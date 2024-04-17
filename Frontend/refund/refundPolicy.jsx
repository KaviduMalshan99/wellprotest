import React from 'react';

import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const RefundPolicy = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="rnmh">Refund</div>
        <div className="rnlp">Home &gt; Refund</div>
        <div className="rnmbtns">
                <button className="transparent-button" onClick={() => navigate(`/refundPolicy`)}>
                    Refund Policy
                </button>
                {" | "}
                <button className="transparent-button" onClick={() => navigate(`/`)}>
                    Refund Now
                </button>
            </div> 
        </div>
    );
};

export default RefundPolicy;
