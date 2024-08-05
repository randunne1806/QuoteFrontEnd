// server.js
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
//const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const uri = "mongodb+srv://sean:gOBYvLh1jis9P3tL@cluster0.liqxi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let loggedInUserEmail = '';

// Connect to MongoDB
client.connect();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

const apiProxy = createProxyMiddleware('/api', {
  target: 'http://173.161.60.88:54322', // Change to your backend server URL
  changeOrigin: true,
  pathRewrite: {
      '^/api': '', // Remove /api prefix when forwarding requests
  },
});

app.use(apiProxy);

app.get('/loggedinuseremail', (req, res) => {
  res.status(200).json({ email: loggedInUserEmail });
});

app.get('/specs', async (req, res) => {
  console.log("endpoint reached");
  try {
    const specsCollection = client.db('amitron-labs-lake').collection('QuickQuote');

    // Sort documents based on the 'createdAt' field in descending order
    const newestSpec = await specsCollection.findOne({}, { sort: { _id: -1 } });
    console.log(newestSpec);
    res.json(newestSpec);
  } catch (error) {
    console.error('Error fetching specs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/quoteoptions', async (req, res) => {
  console.log("endpoint reached");
  try {
    const specsCollection = client.db('amitron-labs-lake').collection('MyQuotes'); // Adjust the database name if needed
    const newestSpec = await specsCollection.find().toArray();
    res.json(newestSpec);
  } catch (error) {
    console.error('Error fetching specs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/partNumber/:partNumber', async (req, res) => {
  const partNumber = req.params.partNumber;
  console.log(partNumber);
  try {
    const quotesCollection = client.db('amitron-labs-lake').collection('Quote-History');
    const quotes = await quotesCollection.find({ "CustomerInfo.PartNum": partNumber }).toArray();
    console.log(quotes);
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static(path.join(__dirname, '../client/build')));

// Login and register routes
// Define your login and register routes here as before

// Serve the React application for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.post('/logout', (req, res) => {
  // Clear the loggedInUserEmail when the user logs out
  loggedInUserEmail = '';
  res.status(200).json({ message: 'Logout successful' });
});

async function uploadToNewMongo(document){
  await client.connect();
  const db = client.db('amitron-labs-lake');
  const collection = db.collection("QuickQuote");
  await db.collection('QuickQuote').insertOne(document);
  console.log("Quote data successfully uploaded to MongoDB");
  console.log(document);
}

app.post('/userdata', (req, res) => {

  const body = req.body;
  console.log("Quote Data:", body);
  uploadToNewMongo(body); // Await the uploadToNewMongo function

  res.status(200).json({ message: "Quote data successfully uploaded to MongoDB" });

});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        // Find user by email
        const user = await client.db('amitron-labs-lake').collection('QuotingApp').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log(email);
        loggedInUserEmail = email;
        
        // Authentication successful
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, company, title, email, password } = req.body;
  
    try {
      // Check if the email already exists in the database
      const existingUser = await client.db('amitron-labs-lake').collection('QuotingApp').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Save user data to the database
      await client.db('amitron-labs-lake').collection('QuotingApp').insertOne({
        firstName,
        lastName,
        company,
        title,
        email,
        password: password
      });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});