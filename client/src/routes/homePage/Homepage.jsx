import { Link } from "react-router-dom";
import "./Homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homePage">
      <img src="orbital.png" alt="orbital" className="orbital" />
      <div className="left">
        <h1>GenieX</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique
          repellendus at neque id obcaecati recusandae veniam officia, placeat
          fugit consequatur doloribus. Incidunt libero error eius repudiandae
          iure labore fugit asperiores.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="bot.png" alt="bot" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt="bot"
            />
            <TypeAnimation
              sequence={[
                ": We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                ": We produce food for Hamsters",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                ": We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                ": We produce food for Chinchillas",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="logo.png" alt="logo" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
