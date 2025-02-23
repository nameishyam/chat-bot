import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./routes/homePage/Homepage";
import DashboardPage from "./routes/dashboardPage/Dashboardpage";
import Chatpage from "./routes/chatPage/Chatpage";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Rootlayout from "./layouts/rootLayout/Rootlayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import Signinpage from "./routes/signinPage/Signinpage";
import Signuppage from "./routes/signupPage/Signuppage";

const router = createBrowserRouter([
  {
    element: <Rootlayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in/*",
        element: <Signinpage />,
      },
      {
        path: "/sign-up/*",
        element: <Signuppage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
