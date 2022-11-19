import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { authService } from "../src/fBase";

const OAuth = () => {
  const onSocialLogin = async (event: any) => {
    const {
      target: { name },
    } = event;

    let provider: any;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
  };

  return (
    <>
      <button onClick={onSocialLogin} name="google">
        Google Login
      </button>
      <button onClick={onSocialLogin} name="github">
        Github Login
      </button>
    </>
  );
};

export default OAuth;
