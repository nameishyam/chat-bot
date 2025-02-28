import { Link, Outlet } from "react-router-dom";
import "./Rootlayout.css";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

const Rootlayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <img src="/logo.png" alt="logo" />
            <span>GenieX</span>
          </Link>
          <div className="user">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};

export default Rootlayout;
