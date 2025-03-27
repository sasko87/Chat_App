import React, { useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Form from "../components/Form/Form";
import { axiosInstance } from "../lib/axios";
import AuthHero from "../AuthHero/AuthHero";

const SignUpPage = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });



  const handleChange = (e) => {
    const {name, value} = e.target
   setFormData({
    ...formData,
    [name]: value
   })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
     const res= await fetch("/api/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
     })
     if (res.ok) {
      const data = await res.json()
      setMessage(data.message)
     }
    } catch (error) {
      console.log(error)
    }
  }

  return <AuthContainer>
    <AuthHero />
    <Form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">E-mail</label>
        <input type="text" name="email" id="email" value={formData.email} onChange={handleChange} />
      </div><div>
        <label htmlFor="password" >Password</label>
        <input type="text" name='password' id='password' value={formData.password} onChange={handleChange} />
      </div>
      {message && <p>{message}</p>}
      <button type="submit">Sign Up</button>
    </Form>
  </AuthContainer>
};

export default SignUpPage;
