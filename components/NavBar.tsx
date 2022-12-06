import { authService } from "../src/fBase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const router = useRouter();
  const pathName = router.pathname;
  const onSocialLogout = () => {
    signOut(authService);
    router.push("/OAuth", "/");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100vw",
        maxWidth: "700px",
        margin: "50px auto 0px",
        fontSize: "40px",
        color: "#00C68E",
      }}
    >
      {pathName === "/Home/[...params]" && (
        <FontAwesomeIcon
          icon={faHouse}
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        />
      )}
      <FontAwesomeIcon
        icon={faRightFromBracket}
        onClick={onSocialLogout}
        style={{ fontSize: "40px", cursor: "pointer" }}
      />
    </nav>
  );
};

export default NavBar;
