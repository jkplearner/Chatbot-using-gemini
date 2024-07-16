import React, { useEffect, useState } from "react";
import Axios from "axios";
import styles from "./sidebar.module.css";

function Sidebar({ isOpen, onClose, userName, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [conversationDates, setConversationDates] = useState([]);

  useEffect(() => {
    if (userName) {
      fetchConversations(userName);
    }
  }, [userName]);

  const fetchConversations = async (userName) => {
    try {
      const response = await Axios.get(`http://localhost:8001/conversation/${userName}`);
      const sortedConversations = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setConversations(sortedConversations);
      const dates = Array.from(new Set(sortedConversations.map(conv => new Date(conv.timestamp).toDateString())));
      setConversationDates(dates);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleDateClick = (date) => {
    const filteredConversations = conversations.filter(
      (conv) => new Date(conv.timestamp).toDateString() === date
    );
    onSelectConversation(filteredConversations);
    onClose();
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
      <div className={styles.conversationList}>
        {conversationDates.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={styles.conversationButton}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
