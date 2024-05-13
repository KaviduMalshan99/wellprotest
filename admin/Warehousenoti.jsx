import React, { useState, useEffect } from 'react';
import Popup from './Popup';

function Warehousenoti() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Read notifications from local storage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.removeItem('notifications');
    setNotifications([]);
  };

  return (
    <div>
      <button onClick={togglePopup}>Open Notifications</button>
      {isOpen && <Popup content={(
        <>
          <b>Warehouse Notifications</b>
          {notifications.map((notification, index) => <p key={index}>{notification}</p>)}
        </>
      )} handleClose={handleClose} />}
    </div>
  );
}

export default Warehousenoti;
