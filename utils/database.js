// utils/database.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI; // Add your MongoDB connection URI here

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB database!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { mongoose };
