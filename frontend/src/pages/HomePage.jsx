import React, { useEffect, useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Card from "../components/Card/Card";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
    <AuthContainer>
      <Sidebar>
        {users.map((user) => (
          <Card
            key={user._id}
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
    </AuthContainer>
  );
};

export default HomePage;
