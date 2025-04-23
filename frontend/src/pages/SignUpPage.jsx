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

  const [steps, setSteps] = useState({ stepOne: true, stepTwo: false });
  const [code, setCode] = useState();
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (steps.stepOne === false && steps.stepTwo === true) {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, steps.stepOne, steps.stepTwo]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          code,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerificationMail = async (e) => {
    e.preventDefault();
    if (steps.stepOne === true && steps.stepTwo === false) {
      if (!formData.fullName.includes(" ")) {
        setMessage("Please enter your full name (name and surname).");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage("Please enter a valid email address.");
        return;
      }

      if (formData.password.length < 8) {
        setMessage("Password must be at least 8 characters.");
        return;
      }
    }
    try {
      const response = await fetch("/api/send-verification-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setSteps({ stepOne: false, stepTwo: true });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error sending verification mail:", error);
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <Container>
      <AuthContainer>
        <AuthHero />
        <Form>
          {steps.stepOne && (
            <>
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

              {message && <AlertMessage>{message}</AlertMessage>}
              <button onClick={handleVerificationMail}>Sign Up</button>
            </>
          )}
          {steps.stepTwo && (
            <>
              <h4 style={{ color: "#addfd0" }}>
                Please enter the verification code sent to your email.
              </h4>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="code">Verification Code</label>
                <input
                  type="number"
                  name="code"
                  id="code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
                <div
                  style={{
                    width: "fit-content",
                    alignSelf: "flex-end",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <span style={{ color: "#addfd0", marginTop: 5 }}>
                    {timer}
                  </span>
                  <button
                    style={{
                      width: "100%",
                      fontSize: "10px",
                      padding: "7px",
                      marginTop: 5,
                    }}
                    disabled={timer === 0 ? false : true}
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerificationMail(e);
                      setTimer(30);
                    }}
                  >
                    Resend
                  </button>
                </div>
              </div>

              {message && <AlertMessage>{message}</AlertMessage>}
              <button onClick={handleSubmit}>Verify</button>
            </>
          )}
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
