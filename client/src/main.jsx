import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./routes/homePage/Homepage";
import DashboardPage from "./routes/dashboardPage/Dashboardpage";
import Chatpage from "./routes/chatPage/Chatpage";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Rootlayout from "./layouts/rootLayout/Rootlayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import Signinpage from "./routes/signinPage/Signinpage";
import Signuppage from "./routes/signupPage/Signuppage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Rootlayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/sign-in/*" element={<Signinpage />} />
          <Route path="/sign-up/*" element={<Signuppage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/chats/:id" element={<Chatpage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
