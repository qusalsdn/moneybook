import { authService } from "../src/fBase";
import { signOut } from "firebase/auth";
import Link from "next/link";

const NavBar = () => {
  const onSocialLogout = () => {
    signOut(authService);
  };

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <Link href={"/"}>
        <button>내역</button>
      </Link>
      <Link href={"/Calendar"}>
        <button>달력</button>
      </Link>
      <button onClick={onSocialLogout}>LogOut</button>
    </nav>
  );
};

export default NavBar;
