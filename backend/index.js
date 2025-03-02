import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
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

app.get(`/api/upload`, (request, response) => {
  const result = imagekit.getAuthenticationParameters();
  response.send(result);
});

app.post(`/api/chats`, (request, response) => {
  const { text } = request.body;
  console.log(text);
});

app.listen(port, () => {
  connect();
  console.log(`the server is running on port ${port}`);
});
