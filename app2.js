const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Conversation = require("./concol");

const app = express();
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/conversation", upload.single("image"), async (req, res) => {
  const { name, question, answer, timestamp } = req.body;
  const image = req.file ? req.file.filename : null; // Get uploaded image filename

  try {
    const conversation = new Conversation({
      name: name,
      question: question,
      answer: answer,
      timestamp: new Date(timestamp),
      image: image // Save image filename or data
    });

    await conversation.save();
    res.status(200).json({ message: "Conversation saved successfully" });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ error: "Failed to save conversation" });
  }
});

app.get("/conversation/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const conversations = await Conversation.find({ name: name });
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

app.listen(8001, () => {
  console.log("Server running on port 8001");
});
