import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Faqemail.css';

const Faqemail = () => {
  const { faqId } = useParams();
  const [formData, setFormData] = useState({
    faqemail: '',
    faqtext: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/faq/${faqId}`);
        const { CustomerEmail, Question } = response.data;

        setFormData({
          faqemail: CustomerEmail,
          faqtext: Question
        });
        setLoading(false);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with an error:', error.response.data);
          setError('Error fetching FAQ data. Please try again.');
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server:', error.request);
          setError('No response received from server. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Error setting up the request:', error.message);
          setError('Error setting up the request. Please check your network connection.');
        }
        setLoading(false);
      }
    };

    fetchFaqDetails();
  }, [faqId]);

  return (
    <div className='MainFaqemail'>
      <h2>Retrieve FAQ Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="faqemailform">
          <div className="faqform-group">
            <label htmlFor="faqemail">Email:</label>
            <input
              type="text"
              id="faqemail"
              name="faqemail"
              value={formData.faqemail}
              disabled
            />
          </div>
          <div className="faqform-group">
            <label htmlFor="faqtext">Asked Question:</label>
            <textarea
              id="faqtext"
              name="faqtext"
              cols="40"
              rows="5"
              value={formData.faqtext}
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Faqemail;
