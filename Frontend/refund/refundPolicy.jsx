import React from 'react';
import './refundPolicy.css'
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const RefundPolicy = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="rnmh">Refund</div>
        <div className="rnlp">Home &gt; Refund</div>
        <div className="rnmbtnss">
                <button id="transparent-buttonrr" onClick={() => navigate(`/refundPolicy`)}>
                    Refund Policy
                </button>
                <div className='iraa'>{" | "}</div>
                <button id="transparent-buttonrr" onClick={() => navigate(`/refund`)}>
                    Refund Now
                </button>
            </div> 
        </div>
    );
};

export default RefundPolicy;
