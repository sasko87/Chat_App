import React, { useEffect, useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Card from "../components/Card/Card";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Container from "../components/Container/Container";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  const token = Cookies.get("jwt");
  const user = jwtDecode(token);

  const usersSidebar = async () => {
    const res = await fetch("/api/get-users-for-sidebar", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      console.log(users);
    }
  };

  useEffect(() => {
    usersSidebar();
  }, []);

  return (
    <Container>
      <Sidebar>
        {users.map((user) => (
          <Card
            key={user._id}
            img={user.profilePicture}
            fullName={user.fullName}
            onClick={() => setSelectedUser(user)}
          />
        ))}
        <Card />
        {selectedUser && console.log(selectedUser)}
      </Sidebar>
      {selectedUser ? (
        <ChatContainer selectedUser={selectedUser} />
      ) : (
        <p>Welcome</p>
      )}
    </Container>
  );
};

export default HomePage;
