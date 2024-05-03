import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './refundOrders.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link, useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const RefundOrders = () => {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initializing navigate function


  useEffect(() => {
    axios.get('http://localhost:3001/api/refunds')
      .then(response => {
        setRefunds(response.data.response);
      })
      .catch(error => {
        console.error('Error fetching refunds:', error);
      });
  }, []);

  useEffect(() => {
    // Filter refunds based on the search term
    const filtered = refunds.filter(refund => {
      const orderId = refund?.orderId || '';
      const customerName = refund?.customerName || '';
      // Check if orderId or customerName includes the search term
      return orderId.toLowerCase().includes(searchTerm.toLowerCase()) || customerName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredRefunds(filtered);
  }, [searchTerm, refunds]);

  const handleDelete = (orderId) => {
    axios.delete(`http://localhost:3001/api/deleterefund/${orderId}`)
      .then(res => {
        setRefunds(prevRefunds => prevRefunds.filter(refund => refund.orderId !== orderId));
        toast.success('Refund deleted successfully!');
      })
      .catch(err => {
        console.error('Error deleting refund:', err);
        toast.error('Error deleting refund.');
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const handleSendEmail = (orderId, customerEmail) => {
    // Set up your email service credentials
    const serviceId = 'service_c2pv3dy';
    const templateId = 'template_iwdczfq';
    const userId = 'jUnSeVe-U6hv47YYW';

    // Prepare the email parameters
    const templateParams = {
      orderId: orderId,
      customerEmail: customerEmail,
    };

    // Send the email
    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('Email sent successfully!', response);
        toast.success('Email sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        toast.error('Error sending email.');
      });
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text('Refund Report', 10, 10);
    doc.autoTable({
      head: [['Order Id', 'Customer Name', 'Customer Email', 'Reason', 'Refund Initiate Date']],
      body: filteredRefunds.map(refund => [
        refund?.orderId,
        refund?.customerName,
        refund?.customerEmail,
        refund?.reason,
        formatDate(refund?.refundDate)
      ]),
    });
    doc.save('refund_report.pdf');
  };
  

  return (
    <div className='mainContainer'>
      <h1>Refund Section</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Refund..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-button">
          <i className="fas fa-search" />
        </button>

      </div>
      <button className="generate-reports-button" onClick={generateReport}>Generate Report</button>


      <div>
        <h3 className='subtitle'>Requested Refunds ({filteredRefunds.length})</h3>
      </div>
      <div className="categorytable">
        <table>
          <tbody>
            <tr>
              <th>Order Id</th>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Reason</th>
              <th>Refund Initiate Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
            {filteredRefunds.map(refund => (
              <tr key={refund?.orderId}>
                <td>{refund?.orderId}</td>
                <td>{refund?.customerName}</td>
                <td>{refund?.customerEmail}</td>
                <td>{refund?.reason}</td>
                <td>{formatDate(refund?.refundDate)}</td>
                <td>{refund.imgUrls && refund.imgUrls.length > 0 ? (
                  <img
                    src={refund.imgUrls[0]}
                    alt={refund.orderId}
                    style={{ maxWidth: '80px', maxHeight: '80px' }} // Set max width and height here
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => { e.target.src = 'placeholder-image-url'; }}
                  />
                ) : (
                    <div>No Image</div>
                  )}
                </td>
                <td>
                  <button className='deletebtn' onClick={() => handleDelete(refund?.orderId)}>Delete</button>
                  <button className='send-email-btn' onClick={() => navigate('/refundemail')}>Send Email</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RefundOrders;
