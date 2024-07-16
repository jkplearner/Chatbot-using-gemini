// mongo.js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/react-login-tut", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, required: true },
  image: { type: String }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
