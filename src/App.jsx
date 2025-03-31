import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Lottie from "lottie-react";
import animationData from "./LottieFiles/EmailLottie.json";

const API_BASE_URL = "https://regret-mail-scheduler-1.onrender.com/api/emails";

const EmailScheduler = () => {
  const [emailData, setEmailData] = useState({
    sender: "",
    recipient: "",
    subject: "",
    message: "",
  });
  const [emailId, setEmailId] = useState(null);
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchScheduledEmails();
  }, []);

  const fetchScheduledEmails = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setScheduledEmails(response.data);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_BASE_URL, emailData);
      setEmailId(response.data.id);
      setSuccessMessage("Email scheduled! You have 10 minutes to edit or cancel.");
      setScheduledEmails((prevEmails) => [...prevEmails, response.data]);
      clearForm();
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  const handleEditEmail = async () => {
    if (!emailId) return alert("No email selected to edit!");
    try {
      await axios.put(`${API_BASE_URL}/${emailId}`, emailData);
      setSuccessMessage("Email updated successfully!");
      fetchScheduledEmails();
      clearForm();
    } catch (error) {
      console.error("Error editing email", error);
    }
  };

  const handleCancelEmail = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setEmailId(null);
      setSuccessMessage("Email canceled successfully.");
      fetchScheduledEmails();
    } catch (error) {
      console.error("Error canceling email", error);
    }
  };

  const loadEmailForEditing = (email) => {
    const emailTime = new Date(email.scheduledTime).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = (emailTime - currentTime) / 60000;
    if (timeDiff > 10) {
      alert("Edit time expired!");
      return;
    }
    setEmailData(email);
    setEmailId(email.id);
  };

  const clearForm = () => {
    setEmailData({ sender: "", recipient: "", subject: "", message: "" });
  };

  return (
    <div className="container">
      <Lottie animationData={animationData} style={{ width: 200, height: 200 }} />
      <h1>Regret Mail Scheduler</h1>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSendEmail} className="email-form">
        <input
          type="email"
          name="sender"
          placeholder="Your Email"
          value={emailData.sender}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="recipient"
          placeholder="Recipient"
          value={emailData.recipient}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={emailData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={emailData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="send-btn">
          {emailId ? "Update Email" : "Send Email"}
        </button>
      </form>

      <h2>My Scheduled Emails</h2>
      {scheduledEmails.length > 0 ? (
        <ul className="email-list">
          {scheduledEmails.map((email) => (
            <li key={email.id}>
              <p>
                <strong>From:</strong> {email.sender}
              </p>
              <p>
                <strong>To:</strong> {email.recipient}
              </p>
              <p>
                <strong>Subject:</strong> {email.subject}
              </p>
              <button
                onClick={() => loadEmailForEditing(email)}
                className="edit-btn"
              >
                Edit
              </button>
              <button
                onClick={() => handleCancelEmail(email.id)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No scheduled emails yet.</p>
      )}
    </div>
  );
};

export default EmailScheduler;
