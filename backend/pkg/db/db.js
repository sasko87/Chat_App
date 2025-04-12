const mongoose = require("mongoose");

const uri = process.env.URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`database connected`);
  } catch (error) {
    console.log(error);
  }
};

connectDB();

module.exports = { connectDB };
