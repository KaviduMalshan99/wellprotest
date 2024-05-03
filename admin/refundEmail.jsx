import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './refundemail.css'

const RefundForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    const emailData = {
      email,
      subject,
      message
    }

    try {
      await axios.post('http://localhost:3001/sendemail', emailData);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error('Error sending email: ', error)
      alert('There was an error sending email!');
    }

  };

  return (
    <div className="refund-form-container">
      <div className="refund-form-inner">
        <div className="refund-form-header">
          <h1 className="refund-form-header-title">Send email to the Customer</h1>
        </div>
        <div className="refund-form-fields">
          <div className="form-field">
            <label className="form-field-label">Email address</label>
            <input
              type="email"
              placeholder="Receiver's Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field-input"
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">Subject</label>
            <input
              type="text"
              placeholder="Enter the subject here..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-field-input"
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">Message</label>
            <textarea
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-field-textarea"
            />
          </div>
          <center><button
            className="send-button"
            onClick={handleSendEmail}
          >
            Send
          </button></center>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RefundForm;