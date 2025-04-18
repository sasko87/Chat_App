import React, { useState } from "react";
import Container from "../components/Container/Container";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import AuthHero from "../AuthHero/AuthHero";
import Form from "../components/Form/Form";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import WelcomeContainer from "../components/WelcomeContainer/WelcomeContainer";
import { useParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const ResetPasswordPage = () => {
  const [message, setMessage] = useState("");
  const [formInfo, setFormInfo] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { id, token } = useParams();
  const handlePasswordChange = (e) => {
    setFormInfo((prevInfo) => {
      const { name, value } = e.target;
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const submitPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/reset-password/${id}/${token}
        `,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInfo),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Internal Server Error");
    }
  };
  return (
    <Container>
      <AuthContainer>
        <AuthHero />
        <Form onSubmit={submitPassword}>
          <PasswordInput
            label={"New Password"}
            name={"newPassword"}
            value={formInfo.newPassword}
            onChange={handlePasswordChange}
          />
          <PasswordInput
            label={"Confirm Password"}
            name={"confirmPassword"}
            value={formInfo.confirmPassword}
            onChange={handlePasswordChange}
          />
          <button>Reset Password</button>
        </Form>
      </AuthContainer>
      <WelcomeContainer />
      {message && <AlertMessage>{message}</AlertMessage>}
    </Container>
  );
};

export default ResetPasswordPage;
