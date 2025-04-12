const cloudinary = require("../lib/cloudinary");
const bcrypt = require("bcryptjs");
const { updateAccount, getAccountById } = require("../pkg/account/account");

const updateProfile = async (req, res) => {
  try {
    const { profilePicture, currentPassword, newPassword } = req.body;
    const userId = req.auth.id;

    let updatedUser;

    // if (!profilePicture) {
    //   return res.status(400).send({ error: "Profile picture is required" });
    // }
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      updatedUser = await updateAccount(
        userId,
        { profilePicture: uploadResponse.secure_url },
        { new: true }
      );
    }

    if (newPassword) {
      const user = await getAccountById(req.auth.id);

      const isPasswordCorrect = bcrypt.compareSync(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).send({ error: "Incorrect Password" });
      }
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      updatedUser = await updateAccount(
        userId,
        { password: hashedNewPassword },
        { new: true }
      );
    }

    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
};

const findAccount = async (req, res) => {
  try {
    const getUser = await getAccountById(req.auth.id);
    return res.status(200).send(getUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateProfile, findAccount };
