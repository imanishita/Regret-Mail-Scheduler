const API_BASE_URL = "https://regret-mail-scheduler-1.onrender.com/api/emails";

const sendEmail = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, email);
    setEmailId(response.data.id);
    alert("Email scheduled! You have 10 minutes to edit or cancel.");
  } catch (error) {
    console.error("Error sending email", error);
  }
};

const editEmail = async () => {
  try {
    await axios.put(`${API_BASE_URL}/${emailId}`, email);
    alert("Email updated!");
  } catch (error) {
    console.error("Error editing email", error);
  }
};

const cancelEmail = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/${emailId}`);
    setEmailId(null);
    alert("Email canceled.");
  } catch (error) {
    console.error("Error canceling email", error);
  }
};
