import React, { useState, useEffect } from "react";
import bi from "./bi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import styles from "./styles.module.css";
import { MdMic, MdMicOff, MdVolumeUp } from "react-icons/md";
import { GoPaperclip } from "react-icons/go";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Axios from "axios";

function BOT() {
  const [file, setFile] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [combinedInput, setCombinedInput] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { name } = location.state || {};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setCombinedInput(transcript || "");
  }, [transcript]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleInputChange = (event) => {
    setCombinedInput(event.target.value);
    setShowWelcomeMessage(false); // Hide the welcome message when input changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("question", combinedInput);
    const result = await bi.run(null, combinedInput);
    formData.append("answer", result);
    formData.append("timestamp", new Date().toISOString());
    if (file) {
      formData.append("image", file);
    }

    try {
      await Axios.post("http://localhost:8001/conversation", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }

    const newMessage = { question: combinedInput, answer: result, image: imagePreview };
    setConversation([...conversation, newMessage]);
    resetTranscript();
    setCombinedInput("");
    setShowWelcomeMessage(true); // Show the welcome message after sending the message
  };

  const handleSelectConversation = (selectedConversations) => {
    setConversation(selectedConversations);
    setShowWelcomeMessage(false);
    toggleSidebar();
  };

  const handleTextToSpeech = (text) => {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleClearConversation = () => {
    setConversation([]);
    setShowWelcomeMessage(true);
  };

  return (
    <div className={styles.chatbotContainer}>
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#434c54",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        History
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        userName={name}
        onSelectConversation={handleSelectConversation}
      />
      {showWelcomeMessage && conversation.length === 0 && (
        <h1 className={styles.welcomeMessage}>Welcome to TalkMasters, {name}</h1>
      )}
      <div className={styles.response}>
        {conversation.map((message, index) => (
          <div key={index} className={styles.message}>
            <p className={styles.question}>{message.question}</p>
            <p className={styles.answer}>
              {message.answer}
              <button
                className={styles.speakerBtn}
                onClick={() => handleTextToSpeech(message.answer)}
              >
                <MdVolumeUp />
              </button>
            </p>
            {message.image && (
              <div className={styles.imageContainer}>
                <img
                  src={`data:image/jpeg;base64,${message.image}`}
                  alt="User provided"
                  className={styles.image}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <div className={styles.fileInputContainer}>
            <label htmlFor="fileInput" className={styles.inputLabel}>
              <GoPaperclip />
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button
              className={styles.chooseFileBtn}
              onClick={handleRemoveImage}
              style={{ display: imagePreview ? "block" : "none" }}
            >
              Remove Image
            </button>
          </div>
          {imagePreview && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          )}
          <div className={styles.inputFieldContainer}>
            <input
              value={combinedInput}
              style={{ width: "500px" }}
              type="text"
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="Type your message here..."
            />
            <button type="button" onClick={handleMicClick} className={styles.micBtn}>
              {listening ? <MdMic /> : <MdMicOff />}
            </button>
            <button type="submit" className={styles.submitBtn}>
              Send
            </button>
            <button onClick={handleClearConversation} className={styles.clearBtn}>
              Clear Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BOT;
