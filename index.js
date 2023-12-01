const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nameRoutes = require('./route');


const app = express()
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/test_Demo', {
})
  .then(() => {
    console.log('Connected to MongoDB');
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', nameRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});