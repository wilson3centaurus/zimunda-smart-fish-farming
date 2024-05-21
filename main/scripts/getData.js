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
    const response = await fetch(
      "https://zimunda-sensor-data-default-rtdb.firebaseio.com/temperature.json"
    );
    const temperatures = await response.json();
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
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort by earliest first
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

async function displayData() {
  try {
    const data = await getDataFromFirebase();
    if (data.length > 0) {
      const latest = data[data.length - 1];
      const first = data[0];
      const latestTemp = latest.celsius;
      const latestTimestamp = latest.timestamp;
      const uptime =
        (new Date(latestTimestamp) - new Date(first.timestamp)) / 1000; // uptime in seconds
      const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8); // HH:MM:SS format

      const statusMessage = `
        Latest Temperature: ${latestTemp}°C
        Last Updated: ${latestTimestamp}
        Total Uptime: ${uptimeString}
      `;

      console.log(statusMessage);

      // Updating HTML
      const lastUpdate = document.getElementById("lastUpdate");
      const upTime = document.getElementById("uptime");
      //const lastUpdate = document.getElementById("lastUpdate");
        lastUpdate.innerText = `${latestTimestamp}`;
        upTime.innerText = `${uptimeString}`;
      
    } else {
      console.log("No data available.");
      const myDiv = document.getElementById("myDiv");
      if (myDiv) {
        myDiv.innerText = "No data available.";
      }
    }
  } catch (error) {
    console.error("Error fetching and displaying data:", error);
    const myDiv = document.getElementById("myDiv");
    if (myDiv) {
      myDiv.innerText = "Error fetching data.";
    }
  }
}

// Display data initially
displayData();

// Set interval to show the system status every 5 seconds
setInterval(displayData, 5000);
