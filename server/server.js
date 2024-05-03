const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./router');
const multer  = require('multer')
const bodyParser = require('body-parser');
const { response } = require('./app');
const nodemailer = require('nodemailer')
// const dotenv = require('dotenv');
// dotenv.config();



const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 } }); // Limit set to 10MB


app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

  
  


app.post('/api/upload', upload.single('image'), (req, res) => {
    // Handle file upload here
});


app.post('/api/upload', upload.single('image'), (req, res) => {
    // Multer saves the uploaded file to the 'uploads/' directory
    // You can handle the file here (e.g., save file path to the database)
    const filePath = req.file.path;
    res.json({ filePath });
  });

const port = 3001;
const host = 'localhost'

const PORT = process.env.PORT || 3001;
app.use(express.json());


app.use(cors());  //resourse share karanna denawa back end to frontend
app.use(express.json());   //data json file walata convert karanwa
app.use(express.static('public'));

// app.use(cors({
//     origin: 'http://localhost:5173'
//   }));
  

const uri = 'mongodb+srv://wellwornsl:wellwornsl123@wellwornsl.ytwnfha.mongodb.net/test?retryWrites=true&w=majority';


const connect = async()=>{
    try{

        await mongoose.connect(uri);
        console.log("Connection Success..!!")

    }
    catch(error){
        console.log("Connection Error",error)
    }
    
};

connect();


const server = app.listen(port,host,() => {
    console.log(`node  server is listning to ${server.address().port}`)
});


app.post('/sendemail', async (req, res) => {
    const { email, subject, message } = req.body;

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
        res.status(200).json({ message: 'Email sent successfully'});
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ error: 'Error sending email'})
    }

});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})


app.use('/api',router);