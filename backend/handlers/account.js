const { default: cloudinaryy } = require("../lib/cloudinary");
const { updateAccount } = require("../pkg/account/account");

const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).send({ error: "Profile picture is required" });
    }

    const uploadResponse = await cloudinaryy.uploader.upload(profilePicture);

    const updatedUser = await updateAccount(
      userId,
      {
        profilePicture: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateProfile };
