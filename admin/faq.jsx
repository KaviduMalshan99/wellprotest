import React, { useState, useEffect } from 'react';
import './faq.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/faqs');
        const faqsFromApi = response.data.response;

        // Format dates with Sri Lanka timezone (GMT+5:30)
        const faqsWithFormattedDate = faqsFromApi.map(faq => {
          const formattedDate = moment(faq.Date).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
          return { ...faq, Date: formattedDate };
        });

        setFaqs(faqsWithFormattedDate);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setError('Error fetching FAQs. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleSendEmail = (faqId) => {
    navigate(`/faqemail/${faqId}`); // Navigate to Faqemail component with the FAQ ID
  };

  const handleDelete = (faqId) => {
    axios.delete(`http://localhost:3001/api/deletefaq/${faqId}`)
      .then(_response => {
        // Filter out the deleted FAQ from the state
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq.FaqID !== faqId));
        console.log("FAQ deleted successfully");

        toast.success('FAQ deleted successfully', {
          position: toast.POSITION.TOP_RIGHT
        });
      })
      .catch(error => {
        console.error('Error deleting FAQ:', error);
        setError('Error deleting FAQ. Please try again later.');
      });
  };

  return (
    <div className='Faq_main'>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        faqs && faqs.length > 0 ? (
          <table className='Faqtable'>
            <thead>
              <tr>
                <th className='faq_theader1'>Faq Number</th>
                <th className='faq_theader2'>Date</th>
                <th className='faq_theader3'>Customer Name</th>
                <th className='faq_theader4'>Customer Email</th>
                <th className='faq_theader5'>Question</th>
                <th className='faq_theader6'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map(faq => (
                <tr key={faq?.FaqID}>
                  <td>{faq?.FaqID}</td>
                  <td>{faq?.Date}</td>
                  <td>{faq?.CustomerName}</td>
                  <td>{faq?.CustomerEmail}</td>
                  <td>{faq?.Question}</td>
                  <td>
                    <button className='Faq_reply' onClick={() => handleSendEmail(faq.FaqID)}>
                      Send <span className="email-icon">&#9993;</span>
                    </button>
                    <button className='Faq_delete' onClick={() => handleDelete(faq.FaqID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No FAQs found.</p>
        )
      )}
      <ToastContainer />
    </div>
  );
};

export default Faq;
