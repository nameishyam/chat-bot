import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

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

app.post(`/api/chats`, ClerkExpressRequireAuth(), async (request, response) => {
  const userId = request.auth.userId;
  const { text } = request.body;
  try {
    // CREATE NEW CHAT

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
    // CHECK IF USERCHATS EXISTS

    const userChats = await UserChats.find({ userId });
    // IF DOESNT EXISTST CREATE NEW ONE AND ADD TEH CHAT IN THE CHATS ARRAY

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
      // IF EXISTS, PUSH IT TO THE EXISTING ARRAY

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

app.get(`/api/userchats`, ClerkExpressRequireAuth(), (request, response) => {
  const userId = request.auth.userId;
  try {
    const userChats = UserChats.find({ userId });
    response.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.use((error, request, response, next) => {
  console.log(error.stack);
  response.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connect();
  console.log(`the server is running on port ${port}`);
});
