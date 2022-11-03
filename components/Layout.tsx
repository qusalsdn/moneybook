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
        <h1 style={{ display: "flex", justifyContent: "center", fontSize: "20px", fontWeight: "bold", marginTop: "30px" }}>
          Loading.....
        </h1>
      )}
    </>
  );
};

export default Layout;
