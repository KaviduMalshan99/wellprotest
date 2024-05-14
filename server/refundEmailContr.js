const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendEmail = async (refundDetails) => {
  // Destructure order details
  const { orderId, id, customerName, customerEmail, reason, refundDate, imgUrls } = refundDetails;


  try {
    // Create a secure transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nirmalsubashana3@gmail.com',
        pass: 'xibv nzlv izdg unem'
      }
    });

    // Use template literals for cleaner string construction
    const mailOptions = {
      from: '"WellWorn Private Limited" <nirmalsubashana3@gmail.com>',
      to: customerEmail,
      subject: `Refund Request Confirmation - ${orderId}`,
      html: `
        <p>Dear ${customerName} </p>
        <p>Thank you for choosing to shop with us. This email is to confirm that we have received your order with the following details:</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Product ID:</strong> ${id}</p>
        <p><strong>Reason for Refunding:</strong>  ${reason}<br>
        <p><strong>Date of refund request:</strong>  ${refundDate}<br>

        <p><strong>Product Details:</strong></p>
      
        <p>We've attached an image of the product you've requested a refund.</p>
        <p>Please note that your refund is now being processed and will be notified to the provided email address within time frame. </p>
        <p>If you have any questions or require further assistance, feel free to contact us at wellworn@gmail.com or reply directly to this email.</p>
        <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again in the future.</p>
        <p>Warm regards,</p>
        <p>WellWorn Private Limited<br>
      `,
      attachments: imgUrls.map((dataUrl, index) => ({
        filename: `RefundImage_${index}.jpg`, // Generate unique filenames
        content: Buffer.from(dataUrl.split(';base64,').pop(), 'base64'), // Convert data URL to Buffer
        cid: `productimage_${index}` // Unique CID for each image
      }))
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
