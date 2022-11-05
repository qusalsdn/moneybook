import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ReactElement, useEffect, useState } from "react";
import { authService } from "../src/fBase";
import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import Router from "./Router";

interface props {
  children: ReactElement;
}

const Layout: NextPage<props> = ({ children }) => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setInit(true);
        setUserObj(user.uid);
      } else {
        setIsLoggedIn(false);
        setInit(true);
        setUserObj(null);
      }
    });
  }, []);

  return (
    <>
      {init ? (
        <Router isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100vh" }}>
          <FontAwesomeIcon
            icon={faSpinner}
            style={{
              fontSize: "100px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default Layout;
