import { ReactElement, useEffect, useState } from "react";
import Home from "../pages";
import OAuth from "./OAuth";
import { authService } from "../src/fBase";
import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";

interface props {
  children: ReactElement;
}

const Layout: NextPage<props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return <>{isLoggedIn ? <Home /> : <OAuth />}</>;
};

export default Layout;
