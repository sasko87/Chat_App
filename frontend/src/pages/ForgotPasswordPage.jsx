import React from "react";
import Container from "../components/Container/Container";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import Form from "../components/Form/Form";
import AuthHero from "../AuthHero/AuthHero";

const ForgotPasswordPage = () => {
  return (
    <Container>
      <AuthContainer>
        <AuthHero />

        <Form>
          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" id="email" />
          </div>
          <button type="submit">Send</button>
        </Form>
      </AuthContainer>
      <WelcomeContainer />
    </Container>
  );
};

export default ForgotPasswordPage;
