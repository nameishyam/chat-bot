import { SignIn } from "@clerk/clerk-react";
import "./Signinpage.css";

const Signinpage = () => {
  return (
    <div className="Signinpage">
      <SignIn path="/sign-in" />
    </div>
  );
};

export default Signinpage;
