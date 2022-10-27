import { ReactElement, useEffect, useState } from "react";
import Home from "../pages";
import OAuth from "./OAuth";
import { authService } from "../src/fBase";
import { onAuthStateChanged } from "firebase/auth";
import { NextPage } from "next";
import NavBar from "./NavBar";
import { useRouter } from "next/router";
import Calendar from "../pages/Calendar";
import Statistics from "../pages/Statistics";

interface props {
  children: ReactElement;
}

const Layout: NextPage<props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathName = router.pathname;

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // 네이게이션에서 선택한 메뉴에 따라 해당 페이지로 이동하는 함수
  const navBarSelection = () => {
    if (pathName === "/") {
      return <Home />;
    } else if (pathName === "/Calendar") {
      return <Calendar />;
    } else {
      return <Statistics />;
    }
  };

  return (
    <>
      {isLoggedIn && <NavBar />}
      {isLoggedIn ? navBarSelection() : <OAuth />}
    </>
  );
};

export default Layout;
