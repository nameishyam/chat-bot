import { Link, Outlet } from "react-router-dom";
import "./Rootlayout.css";

const Rootlayout = () => {
  return (
    <div className="Rootlayout">
      <header>
        <Link to="/">
          <img src="/logo.png" alt="logo" />
          <span>LAMA AI</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Rootlayout;
