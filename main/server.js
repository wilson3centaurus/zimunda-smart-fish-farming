const express = require('express');
const app = express();
const port = 3000; // Change port if needed

// Replace with your actual Javascript code (functions and logic)
const getDataFromFirebase = async () => { ... };
const sendToGrafana = async (data) => { ... };

// Endpoint to retrieve data (similar to your Flask app's /data endpoint)
app.get('/data', async (req, res) => {
  try {
    const data = await getDataFromFirebase();
    res.json(data); // Send data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data"); // Handle errors with proper status code and message
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
