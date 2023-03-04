const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize the app
const app = express();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1/newImgDb', { useNewUrlParser: true });

// Create a schema for the images
const imageSchema = new mongoose.Schema({
  id: String,
  imageUrl: Array
});
const Image = mongoose.model('Image', imageSchema);

// Set up routes for uploading and retrieving images
app.post('/upload/:id', upload.array('images'), (req, res) => {
  // Create an array of image URLs from the uploaded files
  const imageUrls = req.files.map(file => {
    return `http://localhost:3000/uploads/${file.filename}`;
  });

  // Create a new Image document with the ID and image URLs
  const newImage = new Image({
    id: req.params.id,
    imageUrl: imageUrls
  });

  // Save the Image document to the database
  newImage.save().then(()=>{
    res.send("Uploaded Sucessfully..")
  }).catch((err)=>{
    res.status(500).send(err);
  });

});

app.get('/images/:id', (req, res) => {
  // Find all Image documents with the specified ID
  Image.find({ id: req.params.id }).then((val)=>{
    //res.status(200).send(images.map(image => image.imageUrl));
    res.send(val);
  }).catch((err)=>{
    res.status(500).send("Error Occured While Retrieving Images");
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
