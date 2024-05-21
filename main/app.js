const express = require("express");
const axios = require("axios");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnG1Kr_vUrdoVcE2SAbzEiG-tBPSe6-kw",
  authDomain: "zimunda-sensor-data.firebaseapp.com",
  databaseURL: "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
  projectId: "zimunda-sensor-data",
  storageBucket: "zimunda-sensor-data.appspot.com",
  messagingSenderId: "260289735455",
  appId: "1:260289735455:web:c70d169bc8b86945cb1e2a",
  measurementId: "G-WFH79MCPNP",
};

async function getDataFromFirebase() {
  try {
    const response = await axios.get(
      "https://zimunda-sensor-data-default-rtdb.firebaseio.com/temperature.json"
    );
    const temperatures = response.data;
    const data = [];

    if (temperatures) {
      Object.keys(temperatures).forEach((key) => {
        const value = temperatures[key];
        if (value.timestamp) {
          data.push({
            timestamp: value.timestamp,
            celsius: value.celsius,
          });
        }
      });
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by latest first
      return data;
    } else {
      console.log("No temperature data available.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch data from Firebase:", error);
    throw error;
  }
}

function prepareDataForGrafana(data) {
  return data.map((d) => ({ time: d.timestamp, value: d.celsius }));
}

async function sendToGrafana(data) {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/datasources/proxy/UID/", // Replace with your actual Grafana URL and endpoint
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "glsa_SaMo6XLHNQqUQwIgXbvBTZsnaCNvNK9w_f175f712",
        },
      }
    );
    console.log("Data sent to Grafana successfully!");
  } catch (error) {
    console.error("Failed to send data to Grafana:", error);
  }
}

const app = express();
const port = 3001;

// Endpoint to mimic Flask's /data route
app.get("/data", async (req, res) => {
  try {
    const data = await getDataFromFirebase();
    const grafanaData = prepareDataForGrafana(data);
    await sendToGrafana(grafanaData); // Send data to Grafana
    res.json(data); // Send data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data: " + error); 
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
