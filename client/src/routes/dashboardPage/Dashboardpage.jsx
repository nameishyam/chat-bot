import "./dashboardPage.css";
import { useAuth } from "@clerk/clerk-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const DashboardPage = () => {
  const { userId } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    await fetch(`${backendUrl}/api/chats`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, userId }),
    });
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="logo.png" alt="logo" />
          <h1>GenieX</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="chat.png" alt="chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="image.png" alt="image" />
            <span>Analyze images</span>
          </div>
          <div className="option">
            <img src="code.png" alt="code" />
            <span>Help with the code</span>
          </div>
        </div>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input type="text" name="text" placeholder="Ask me anything..." />
            <button>
              <img src="arrow.png" alt="arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
