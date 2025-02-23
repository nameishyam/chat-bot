import { useRef } from "react";
import "./chatPage.css";

const Chatpage = () => {
  const endRef = useRef(null);
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div className="message">test message from ai</div>
          <div className="message user">test message from user</div>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
