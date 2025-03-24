import React from "react";
import Form from "../components/Form/Form";
import AuthContainer from "../components/AuthContainer/AuthContainer";

const LoginPage = () => {
  return (
    <AuthContainer>
      <Form>
        <div>
          <label htmlFor="">E-mail</label>
          <input type="text" />
        </div>
        <div >
          <label htmlFor="">password</label>
          <input type="text" />
          <button>Sign in</button>
        </div>
      </Form>
    </AuthContainer>
  );
};

export default LoginPage;
