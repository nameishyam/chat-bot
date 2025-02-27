import { useEffect, useRef } from "react";
import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";

const Chatpage = () => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);
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
          <NewPrompt />
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
