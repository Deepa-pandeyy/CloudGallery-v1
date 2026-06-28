const path = require("path");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);
mongoose.set("bufferCommands", false);

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
  });
  console.log("connected to DB");
}

module.exports = connectDB;