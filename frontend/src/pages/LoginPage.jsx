import React, { useEffect, useState } from "react";
import Form from "../components/Form/Form";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import AuthHero from "../AuthHero/AuthHero";
import { Link, useNavigate } from "react-router-dom";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import Container from "../components/Container/Container";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import AlertMessage from "../components/AlertMessage/AlertMessage";
import { FcCheckmark } from "react-icons/fc";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // 2 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [message]);

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
        setMessage(data.error);
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
