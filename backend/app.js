const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const authRouter = require('./router/authRoute.js');
const databaseconnect = require('./config/databaseConfig.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// connect to db
databaseconnect();

app.use(express.json()); // Built-in middleware
app.use(cookieParser()); // Third-party middleware

app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true })); // Third-party middleware

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Handle file uploads (replace 'profileImage' with the field name used in the client-side form)
app.post('/api/upload', upload.single('profileImage'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Handle the file as needed (e.g., save the file path to the database)

    return res.status(200).json({ success: true, message: 'File uploaded successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Auth router
app.use('/api/auth', authRouter);

app.use('/', (req, res) => {
  res.status(200).json({ data: 'JWTauth server ;)' });
});

module.exports = app;
