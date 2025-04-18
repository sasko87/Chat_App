const mongoose = require("mongoose");

const { MONGO_USER, MONGO_PASS, MONGO_NAME } = process.env;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.frwhldk.mongodb.net/${MONGO_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

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
