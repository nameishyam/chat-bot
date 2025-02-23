import { SignUp } from "@clerk/clerk-react";
import "./Signuppage.css";

const Signuppage = () => {
  return (
    <div className="Signuppage">
      <SignUp path="/sign-up" />
    </div>
  );
};

export default Signuppage;
