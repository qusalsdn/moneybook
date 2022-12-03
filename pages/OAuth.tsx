import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { authService } from "../src/fBase";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

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
    console.log(authService, provider);
    if (provider) {
      await signInWithPopup(authService, provider);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        maxWidth: "600px",
        margin: "200px auto 0px",
        backgroundColor: "#00C68E",
        borderRadius: "15px",
      }}
    >
      <h1
        style={{
          color: "white",
          justifyContent: "flex-start",
          fontSize: "30px",
          fontWeight: "bold",
          marginTop: "30px",
          marginLeft: "30px",
          marginBottom: "50px",
        }}
      >
        로그인
      </h1>
      <button
        onClick={onSocialLogin}
        name="google"
        className="loginButton"
        style={{
          margin: "15px 50px",
          backgroundColor: "white",
        }}
      >
        <FontAwesomeIcon icon={faGoogle} style={{ color: "black", fontSize: "30px", marginRight: "10px" }} />
        <span style={{ fontSize: "25px", marginRight: "10px" }}>구글 로그인</span>
        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "20px" }} />
      </button>
      <button
        onClick={onSocialLogin}
        name="github"
        className="loginButton"
        style={{
          margin: "15px 50px 50px 50px",
          backgroundColor: "#374151",
        }}
      >
        <FontAwesomeIcon icon={faGithub} style={{ color: "white", fontSize: "30px", marginRight: "10px" }} />
        <span style={{ fontSize: "25px", marginRight: "10px", color: "white" }}>깃헙 로그인</span>
        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "20px", color: "white" }} />
      </button>
    </div>
  );
};

export default OAuth;
