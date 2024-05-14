const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendEmaill = async (orderDetails) => {
    const {
        email,
        firstName,
        lastName,
        orderId,
        orderDate,
        address,
        city,
        postalCode,
        country,
        ProductName,
        quantity,
        size,
        color,
        image
    } = orderDetails;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vgamaka@gmail.com',
                pass: 'orer voqf gmzy ydhb'
            }
        });

        const mailOptions = {
            from: '"WellWorn Private Limited" <vgamaka@gmail.com>',
            to: email,
            subject: `Order Confirmation - ${orderId}`,
            html: `
                <p>Dear ${firstName} ${lastName},</p>
                <p>Thank you for choosing to shop with us. This email is to confirm that we have received your order with the following details:</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Shipping Address:</strong><br>
                ${address},<br>
                ${city},<br>
                ${postalCode},<br>
                ${country}</p>
                <p><strong>Product Details:</strong></p>
                <ul>
                    <li><strong>Product Name:</strong> ${ProductName}</li>
                    <li><strong>Quantity:</strong> ${quantity}</li>
                    <li><strong>Size:</strong> ${size || 'Not specified'}</li>
                    <li><strong>Color:</strong> ${color || 'Not specified'}</li>
                </ul>
                <p>We've attached an image of the product you've ordered for your reference.</p>
                <p>Please note that your order is now being processed and will be shipped to the provided address within the estimated delivery time frame. You will receive a separate email with tracking information once your order has been dispatched.</p>
                <p>If you have any questions or require further assistance, feel free to contact us at wellworn@gmail.com or reply directly to this email.</p>
                <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again in the future.</p>
                <p>Warm regards,</p>
                <p>WellWorn Private Limited<br>

            `,
            attachments: [{
                filename: 'ProductImage.jpg',
                path: image[0], 
                cid: 'productimage' 
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


module.exports = { sendEmaill };
