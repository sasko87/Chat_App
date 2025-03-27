import React, { useState } from "react";
import Form from "../components/Form/Form";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import AuthHero from "../AuthHero/AuthHero";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
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
        setMessage(data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
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

  console.log(formData.email);
  return (
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          {message && <p>{message}</p>}
          <button>Sign in</button>
        </div>
      </Form>
    </AuthContainer>
  );
};

export default LoginPage;
