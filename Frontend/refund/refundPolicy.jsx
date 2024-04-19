import React from 'react';
import Footer from '../Footer/Footer'

import { Link, useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const RefundPolicy = () => {
    

    return (
        <div>
            <div className="rnmh">Refund</div>
        <div className="rnlp">Home &gt; Refund</div>
        <div className="rnmbtns">
        <Link to='/refundpolicy'><button className="transparent-button" >
                    Refund Policy
                </button></Link>
                {" | "}
                <Link to='/refund'> <button className="transparent-button" >
                    Refund Now
                </button></Link >
            </div> 

            <Footer/>
        </div>
    );
};

export default RefundPolicy;
