import { Link } from "react-router-dom";
import "./chatList.css";

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create New Chat</Link>
      <Link to="/">Explore</Link>
      <Link to="/">Contact</Link>
      <hr />
      <div className="title">RECENT CHATS</div>
      <div className="list">
        <Link to="/">My chat title</Link>
        <Link to="/">My chat title</Link>
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="logo" />
        <div className="texts">
          <span>Upgrade to GenieX pro</span>
          <span>Get unlimited access to all the features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
