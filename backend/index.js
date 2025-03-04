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

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((request, response, next) => {
  response.header(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_URL || "http://localhost:5173"
  );
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

// app.get(`/api/test`, ClerkExpressRequireAuth(), (request, response) => {
//   const userId = request.auth.userId;
//   console.log(userId);
//   response.send("success");
// });

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
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
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
              title: text.substring(0, 40),
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

app.listen(port, () => {
  connect();
  console.log(`the server is running on port ${port}`);
});
