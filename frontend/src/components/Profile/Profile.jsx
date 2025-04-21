import React, { useEffect, useState } from "react";
import Container from "../Container/Container";
import Form from "../Form/Form";
import classes from "./Profile.module.css";
import Cookie from "js-cookie";
import PasswordInput from "../PasswordInput/PasswordInput";
import AlertMessage from "../AlertMessage/AlertMessage";
import { MdOutlineCameraAlt } from "react-icons/md";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [selectedImage, setSelectecImage] = useState();
  const token = Cookie.get("jwt");
  const [formInfo, setFormInfo] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState();

  const fetchUserData = async () => {
    const res = await fetch("/api/find-account", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();

      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectecImage(base64Image);
    };
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

  const updateProfile = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/update-profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePicture: selectedImage,
        currentPassword: formInfo.currentPassword,
        newPassword: formInfo.newPassword,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setFormInfo({
        currentPassword: "",
        newPassword: "",
      });
    } else {
      setMessage(data.error);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000); // 2 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [message]);

  let image;

  if (selectedImage) {
    image = selectedImage;
  } else if (!userData || userData.profilePicture === "") {
    image = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
  } else {
    image = userData.profilePicture;
  }

  if (!userData) return <div>Loading...</div>;
  return (
    <Container style={{ alignItems: "center", justifyContent: "center" }}>
      <Form onSubmit={updateProfile}>
        <div style={{ position: "relative" }}>
          <label htmlFor="profilePicture" className={classes.profileImage}>
            <img src={image} className={classes.profileImage} />
            <div className={classes.cameraIconContainer}>
              <MdOutlineCameraAlt className={classes.cameraIcon} />
            </div>
          </label>
          <input
            type="file"
            name="profilePicture"
            id="profilePicture"
            className={classes.profilePictureInput}
            onChange={handleUploadImage}
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" value={userData.fullName} />
        </div>
        <div>
          <label htmlFor="email">E-mail</label>
          <input type="email" value={userData.email} />
        </div>
        <PasswordInput
          label="Current Password"
          onChange={handleChange}
          name="currentPassword"
          value={formInfo.currentPassword}
        />
        <PasswordInput
          label="New Password"
          onChange={handleChange}
          name="newPassword"
          value={formInfo.newPassword}
        />
        <button>Save Changes</button>
      </Form>
      {message && <AlertMessage>{message}</AlertMessage>}
    </Container>
  );
};

export default Profile;
