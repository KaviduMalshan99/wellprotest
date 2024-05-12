import React from 'react';
import './popup.css'

const Popup = ({ handleClose, content }) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={handleClose}>x</span>
        {content}
      </div>
    </div>
  );
};

export default Popup;
