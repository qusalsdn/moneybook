import Home from "../pages";
import OAuth from "../pages/OAuth";
import { NextPage } from "next";
import NavBar from "./NavBar";
import { useRouter } from "next/router";
import Statistics from "../pages/Statistics/[...params]";
import Detail from "../pages/Home/[...params]";

interface props {
  isLoggedIn: boolean;
  userObj: string;
}

const Router: NextPage<props> = ({ isLoggedIn, userObj }) => {
  const router = useRouter();
  let pathName = router.pathname;
  if (pathName === "/OAuth") {
    pathName = "/";
  }

  // 네이게이션에서 선택한 메뉴에 따라 해당 페이지로 이동하는 함수
  const navBarSelection = () => {
    if (pathName === "/") {
      return <Home userObj={userObj} />;
    } else if (pathName === "/Statistics/[...params]") {
      return <Statistics />;
    } else if (pathName === "/Home/[...params]") {
      return <Detail />;
    }
  };

  const navBarHide = () => {
    if (pathName != "/Statistics/[...params]") {
      return <NavBar />;
    }
  };
  return (
    <>
      {isLoggedIn && navBarHide()}
      {isLoggedIn ? navBarSelection() : <OAuth />}
    </>
  );
};

export default Router;
