import { useState } from "react";
import Home from "../pages";
import OAuth from "./OAuth";
import { NextPage } from "next";
import NavBar from "./NavBar";
import { useRouter } from "next/router";
import Calendar from "../pages/Calendar";
import Statistics from "../pages/Statistics";

interface props {
  isLoggedIn: boolean;
  userObj: string;
}

const Router: NextPage<props> = ({ isLoggedIn, userObj }) => {
  const router = useRouter();
  const pathName = router.pathname;
  console.log(userObj);

  // 네이게이션에서 선택한 메뉴에 따라 해당 페이지로 이동하는 함수
  const navBarSelection = () => {
    if (pathName === "/") {
      return <Home userObj={userObj} />;
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

export default Router;
