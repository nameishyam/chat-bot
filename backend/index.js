import express from "express";
import ImageKit from "imagekit";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

const port = process.env.PORT || 3000;

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_ENDPOINT,
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
});

app.get(`/api/upload`, (request, response) => {
  const result = imagekit.getAuthenticationParameters();
  response.send(result);
});

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
