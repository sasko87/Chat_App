import React, { useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Form from "../components/Form/Form";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  return <AuthContainer>
    <Form>
      <div>
        <label htmlFor="">Full Name</label>
        <input type="text" />
      </div>
      <div>
        <label htmlFor="">E-mail</label>
        <input type="text" />
      </div><div>
        <label htmlFor="">Password</label>
        <input type="text" />
      </div>
      <button>Sign Up</button>
    </Form>
  </AuthContainer>
};

export default SignUpPage;
