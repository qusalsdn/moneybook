import { authService } from "../src/fBase";
import { signOut } from "firebase/auth";

const Home = () => {
  const onSocialLogout = () => {
    signOut(authService);
  };

  return <button onClick={onSocialLogout}>LogOut</button>;
};

export default Home;
