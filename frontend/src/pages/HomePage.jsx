import React from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Card from "../components/Card/Card";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";

const HomePage = () => {
  return <AuthContainer>
    <Sidebar>

    <Card />
    </Sidebar>
    <ChatContainer>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad modi esse rerum molestias similique ab eaque facere? Quos alias deleniti voluptatum laborum quo dolores dolore explicabo tempore? Eius, nesciunt placeat!</p>
    </ChatContainer>
  </AuthContainer>;
};

export default HomePage;
