import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddOrderCancellation from './AddOrderCancellation';
import DelayOrderInquiry from './DelayOrderInquiry.jsx';
import './CustomerTracking.css';

const CustomerTracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDelayOrderPopup, setShowDelayOrderPopup] = useState(false);

  const orderId = 'OID41499';

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/tracking/${orderId}`);
        setTrackingInfo(data.trackingEntry);
        setLoading(false);
      } catch (err) {
        setError('Tracking information not available.');
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    return formattedDate;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const trackingSteps = [
    ' dispatched from the Chinese warehouse',
    ' arrived at Chinese custom',
    ' handed over to Airfreight company',
    ` arrived at ${trackingInfo.country} custom`,
    ' handed over to Courier company',
    ' delivered. Thank you for shopping WELL WORN'
  ];
     
  const trackingStatus = [
    ' Dispatch from CN warehouse',
    ' CN custom',
    ' Airfreight company',
    ` Arrived at  custom`,
    ' Courier selected',
    ' Delivered.'
  ];
  return (
    <div>
      <div className='costomerTracking'>
      <h2>Track Your Order</h2>
      <div>Order ID: {orderId}</div>
      {trackingInfo && (
        <>
          <div>Estimated delivery date: {formatDate(trackingInfo.estimatedDate)}</div>
          <div className="progress-bar">
           
            {['firstStateDate', 'secondStateDate', 'thirdStateDate', 'fourthStateDate', 'fifthStateDate', 'sixthStateDate'].map((state, index) => (
              <div key={index} className={`progress-step ${trackingInfo[state] ? 'active' : ''}`}>
                {trackingInfo[state] && (
                  <div className='costomerTracking_progress-details'>
                    <br></br>
                    
                    <div className='costomerTracking_step-status'>{trackingStatus[index]}</div>
                    <div className='costomerTrackingDate'>{formatDate(trackingInfo[state])}</div>
                    
                  </div>
                )}
              </div>
            ))}
          </div>
          <br />
          <div className='costomerTrackingDetails'>
            <h3 className='costomerTrackingDetails_h3'>Tracking Details</h3>
            <div className="costomerTracking_black-bar"></div>
            {['firstStateDate', 'secondStateDate', 'thirdStateDate', 'fourthStateDate', 'fifthStateDate', 'sixthStateDate'].map((state, index) => (
              <div key={index}>
                {trackingInfo[state] && (
                  <div>
                    {`${formatDate(trackingInfo[state]) } Your package has ${trackingSteps[index]}.`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
 <div >
 <button className='buttonTracking' onClick={() => setShowPopup(true)}>Cancel Order</button>
        {showPopup && <AddOrderCancellation orderId={orderId} onClose={() => setShowPopup(false)} />}</div>
         <br/>

         <div >
            {/* Button for Delay Order Inquiry */}
            <button className='buttonTracking' onClick={() => setShowDelayOrderPopup(true)}>Ask Order Inquiry</button>
            {/* Popup for Delay Order Inquiry */}
            {showDelayOrderPopup && <DelayOrderInquiry onClose={() => setShowDelayOrderPopup(false)} />}
          </div>

      </div>
    </div>
  );
};

export default CustomerTracking;