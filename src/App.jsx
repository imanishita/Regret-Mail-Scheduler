import { useState } from "react";
import axios from "axios";
import "./App.css";
import Lottie from  "lottie-react";
import animationData from "./LottieFiles/EmailLottie.json";

function App() {
  const [email, setEmail] = useState({ recipient: "", subject: "", message: "" });
  const [emailId, setEmailId] = useState(null);
  
  const handleChange = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value });
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/emails", email);
      setEmailId(response.data.id);
      alert("Email scheduled! You have 10 minutes to edit or cancel.");
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  const editEmail = async () => {
    try {
      await axios.put(`http://localhost:8080/api/emails/${emailId}`, email);
      alert("Email updated!");
    } catch (error) {
      console.error("Error editing email", error);
    }
  };

  const cancelEmail = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/emails/${emailId}`);
      setEmailId(null);
      alert("Email canceled.");
    } catch (error) {
      console.error("Error canceling email", error);
    }
  };

  return (
    <div className="container">
       <Lottie animationData={animationData} style={{ width: 200, height: 200 }} />
      <h1>Regret Mail Scheduler</h1>
      <input type="email" name="recipient" placeholder="Recipient" value={email.recipient} onChange={handleChange} />
      <input type="text" name="subject" placeholder="Subject" value={email.subject} onChange={handleChange} />
      <textarea name="message" placeholder="Message" value={email.message} onChange={handleChange}></textarea>
      <button onClick={sendEmail}>Send Email</button>
      {emailId && (
        <div>
          <button onClick={editEmail}>Edit Email</button>
          <button onClick={cancelEmail}>Cancel Email</button>
        </div>
      )}
    </div>
  );
}

export default App;