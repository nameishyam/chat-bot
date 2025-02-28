import express from "express";
import ImageKit from "imagekit";

const app = express();

const port = process.env.PORT || 3000;

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_ENDPOINT,
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
});

app.get(`/api/upload`, (requrest, response) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
