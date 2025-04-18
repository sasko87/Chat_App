import React, { useState, useEffect } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Form from "../components/Form/Form";
import AuthHero from "../AuthHero/AuthHero";
import Container from "../components/Container/Container";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const SignUpPage = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.includes(" ")) {
      setMessage("Please enter your full name (name and surname).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      const errorData = await res.json();
      setMessage(errorData.error);
    }
  };

  return (
    <Container>
      <AuthContainer>
        <AuthHero />
        <Form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <PasswordInput
            onChange={handleChange}
            value={formData.password}
            label={"Password"}
            name="password"
          />
          {/* <div>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div> */}
          {message && <AlertMessage>{message}</AlertMessage>}
          <button type="submit">Sign Up</button>
        </Form>
        <p style={{ marginTop: 20, color: "#72948a" }}>
          Already have an account?{" "}
          <span>
            <Link
              to="/login"
              style={{ color: "#8ab2a6", textDecoration: "none", opacity: 1 }}
            >
              Login
            </Link>
          </span>
        </p>
      </AuthContainer>
      <WelcomeContainer />
    </Container>
  );
};

export default SignUpPage;
