import { IKContext, IKImage } from "imagekitio-react";

const urlEndpoint = "<YOUR_IMAGEKIT_URL_ENDPOINT>";
const publicKey = "<YOUR_IMAGEKIT_PUBLIC_KEY>";
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3001/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = () => {
  return <div>Upload</div>;
};

export default Upload;
