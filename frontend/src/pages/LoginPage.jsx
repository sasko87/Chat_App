import React, { useState } from "react";
import Form from "../components/Form/Form";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import AuthHero from "../AuthHero/AuthHero";
import { Link, useNavigate } from "react-router-dom";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import Container from "../components/Container/Container";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import AlertMessage from "../components/AlertMessage/AlertMessage";
import { FcCheckmark } from "react-icons/fc";
// import { FaRegEyeSlash } from "react-icons/fa6";
// import { FaRegEye } from "react-icons/fa6";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  // const [visiblePassword, setVisiblePassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          <span>
            <FcCheckmark /> {data.message}
          </span>
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(res.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };
  return (
    <>
      <Container>
        <AuthContainer>
          <AuthHero />
          <Form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <PasswordInput
              label={"Password"}
              onChange={handleChange}
              value={formData.password}
              message={message}
              name="password"
            />
            {/* <div style={{ position: "relative" }}>
              <label htmlFor="password">Password</label>
              <input
                type={!visiblePassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              {visiblePassword ? (
                <FaRegEyeSlash
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "22%",
                    cursor: "pointer",
                    color: "#8ab2a6",
                  }}
                  onClick={() => {
                    setVisiblePassword((prevData) => !prevData);
                  }}
                />
              ) : (
                <FaRegEye
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "22%",
                    cursor: "pointer",
                    color: "#8ab2a6",
                  }}
                  onClick={() => {
                    setVisiblePassword((prevData) => !prevData);
                  }}
                />
              )}
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "#8ab2a6",
                  textAlign: "right",
                }}
              >
                Forgot Password
              </Link>
              {message && <AlertMessage>{message}</AlertMessage>}
            </div> */}
            <button>Sign in</button>
            {message && <AlertMessage>{message}</AlertMessage>}
          </Form>
          <p style={{ marginTop: 20, color: "#72948a" }}>
            Don't have an accout?{" "}
            <span>
              <Link
                to="/signup"
                style={{ color: "#8ab2a6", textDecoration: "none", opacity: 1 }}
              >
                Register
              </Link>
            </span>
          </p>
        </AuthContainer>
        <WelcomeContainer />
      </Container>
    </>
  );
};

export default LoginPage;
