import { authService } from "../src/fBase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();
  const onSocialLogout = () => {
    signOut(authService);
    router.push("/OAuth", "/");
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
