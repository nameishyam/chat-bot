import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "@clerk/express";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import dotenv from "dotenv";
import model from "./lib/gemini.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  response.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_ENDPOINT,
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
});

const generateTitle = async (text) => {
  try {
    const prompt = `Imagine that you are a chatbot and user is asking you questions. each chat starts with a user message. and for each chat there will be a chat title. the chat title has to be decided by yourself only. all you need to do is to generate the appropriate title for the user message: "${text}". and remember that only to generate the title for the user message. you don't need to generate the response for the user message. just the title.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const title = response.text().trim();
    return title || text.substring(0, 40);
  } catch (error) {
    console.log("Error generating title:", error);
    return text.substring(0, 40);
  }
};

app.get(`/api/upload`, (request, response) => {
  const result = imagekit.getAuthenticationParameters();
  response.send(result);
});

app.post(`/api/chats`, requireAuth(), async (request, response) => {
  const userId = request.auth.userId;
  const { text } = request.body;
  try {
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });
    const savedChat = await newChat.save();
    const userChats = await UserChats.find({ userId });

    const title = await generateTitle(text);

    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title,
          },
        ],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title,
            },
          },
        }
      );
    }
    response.status(201).send(newChat._id);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.get(`/api/userchats`, requireAuth(), async (request, response) => {
  const userId = request.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });
    response.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.get(`/api/chats/:id`, requireAuth(), async (request, response) => {
  const userId = request.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: request.params.id, userId });
    response.status(200).send(chat);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.put(`/api/chats/:id`, requireAuth(), async (request, response) => {
  const userId = request.auth.userId;
  const { question, answer, img } = request.body;
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];
  try {
    const updatedChat = await Chat.updateOne(
      { _id: request.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    response.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.use((error, request, response, next) => {
  console.log(error.stack);
  response.status(401).send("Unauthenticated!");
});

app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  connect();
  console.log(`the server is running on port ${port}`);
});
