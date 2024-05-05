const nodemailer = require('nodemailer');

exports.sendEmail = async (email, subject, message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nirmalsubashana3@gmail.com',
            pass: 'ejcv qynb jqwf atqj'
        }
    });

    let mailOptions = {
        from: 'nirmalsubashana3@gmail.com',
        to: email,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Refund email sent successfully');
    } catch (error) {
        console.error('Error sending refund email: ', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};
