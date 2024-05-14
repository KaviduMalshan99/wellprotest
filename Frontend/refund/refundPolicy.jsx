import React from 'react';

import './refundPolicy.css'
// import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook

import Footer from '../Footer/Footer'
import Header from '../Header/Header';

import { Link, useNavigate } from 'react-router-dom'; // Importing useNavigate hook


const RefundPolicy = () => {
    const navigate = useNavigate();


    return (
        <div>
        <Header/>
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

            <div className="refund-policy-content">
                <h2>DELIVERY AND RETURNS</h2>
                <ul>
                    <li>We usually deliver within 4-6 working days of placement of the order. For orders with multiple items and different delivery times, the longest delivery time applies.</li>
                    <li>We would like you to have complete peace of mind when buying products from foaclothing.com. You can refund any item within 7 days and exchange any item within 14 days of purchase (terms and conditions apply). The refund amount will be credited back to your foaclothing.com account as store credits or credit points.</li>
                    <li>In case of manufacturing defect with the item, it can be returned to us within 14 days of receipt and you will be refunded after the items have been inspected by us. if reverse pickup is unsuccessful after three attempts or more than two weeks after pickup was initiated for the first time, the refund request will be cancelled. Similarly if the product is self-shipped, and has not been dispatch from consumer after two weeks of refund initiation, refund request will be cancelled.</li>
                    <li>Within the first 7 – 14 days of receipt we will accept all exchanges and refunds except those deemed to have been damaged by the customers themselves outside of normal everyday use.</li>
                    <li>Please do take care that you pack items securely and safely to prevent any loss or damage during transit and with all original packaging (tags etc.). For all self-shipped returns, we recommend you use a reliable courier service.</li>
                    <li>Once your return is received by us, the refund is subject to your return having met the requirements of being undamaged and dispatched by you within 7 days.</li>
                    <li>You can inform us within 7 days for refund and 14 days for exchange of receiving the parcel by writing to us at official@foaclothing.com. Please make sure that the items are securely packed and handed to our pick-up person.</li>
                    <li>We will arrange a reverse pickup once for an exchange or refund for an order. Any reverse shipment charges other than the one time will be borne by the customer.</li>
                    <li>Please note that shipping charges will not be reimbursed.</li>
                </ul>

                <h2>RETURN OPTIONS</h2>
                <h3>OPTION A</h3>
                <p>
                    It’s a simple 2 step process:
                </p>
                <ol>
                    <li>
                        Please write to us at <a href="mailto:official@wellworn.com">official@wellworn.com</a> from your registered email ID along with your order ID & registered phone number so that our customer service team may assist you.
                    </li>
                    <li>
                        In case of damaged/broken goods, send us the images on <a href="mailto:official@wellworn.com">official@wellworn.com</a>.
                    </li>
                </ol>
                <h3>OPTION B</h3>
                <p>
                    It’s a simple 1 step process:
                </p>
                <ol>
                    <li>
                        Fill out the return form shipped to you with the order, follow the instructions on the form and ship the products to us.
                    </li>
                </ol>
                <p>
                    It can take up to 14 days or longer for us to receive your return, depending on your location and which courier service you use. Once we receive your returned item, we will inspect and process the same within 48 hours to ensure you receive your refund as quickly as possible. In order to keep you in the loop, we will send you an email confirming the status of your return. Usually you will receive your refund in term of store credit at the end of this 48 hour window.
                </p>

                <h2>INTERNATIONAL SHIPPING</h2>
                <p>
                    Freedom Over Anything is not liable to pay any import charges or any other costs incurred by the Customs Department or the Government of the respective countries.
                </p>
            </div>

            <Footer/>
        </div>
    );
};

export default RefundPolicy;



