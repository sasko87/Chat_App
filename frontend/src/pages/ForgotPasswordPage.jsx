import React, { useState } from "react";
import Container from "../components/Container/Container";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import Form from "../components/Form/Form";
import AuthHero from "../AuthHero/AuthHero";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setEmail("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong. Please try again later.");
    }
  };
  return (
    <Container>
      <AuthContainer>
        <AuthHero />
        <Form onSubmit={handleForgotPassword}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Send</button>
        </Form>
      </AuthContainer>
      <WelcomeContainer />
      {message && <AlertMessage>{message}</AlertMessage>}
    </Container>
  );
};

export default ForgotPasswordPage;
