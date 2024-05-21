import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
//import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/dist/email.min.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnG1Kr_vUrdoVcE2SAbzEiG-tBPSe6-kw",
  authDomain: "zimunda-sensor-data.firebaseapp.com",
  databaseURL: "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
  projectId: "zimunda-sensor-data",
  storageBucket: "zimunda-sensor-data.appspot.com",
  messagingSenderId: "260289735455",
  appId: "1:260289735455:web:c70d169bc8b86945cb1e2a",
};

initializeApp(firebaseConfig);

const database = getDatabase();

async function getDatabaseJSON(dataPath) {
  try {
    const snapshot = await get(ref(database, dataPath));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data found at the specified path");
    }
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
}

async function generateReport() {
  const dataPath = "/";
  try {
    const data = await getDatabaseJSON(dataPath);
    const temperatures = Object.values(data.temperature).map(
      ({ celsius, timestamp }) => ({
        timestamp: new Date(timestamp),
        temperature: celsius,
      })
    );

    const highestReading = Math.max(...temperatures.map((r) => r.temperature));
    const lowestReading = Math.min(...temperatures.map((r) => r.temperature));
    const averageReading =
      temperatures.reduce((sum, temp) => sum + temp.temperature, 0) /
      temperatures.length;

    const report = `
      <div style="font-family: Arial, sans-serif; border-radius: 5px; height: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; flex-direction: space-between; align-items: start;">
            <h1 style="margin: 0; color: #2196f3;">Zimunda Estate</h1>
            <h2 style="margin: 0; font-weight: normal; color: #9e9e9e;">Periodic Report</h2>
          </div>
          <img src="/main/images/logo-transparent.png" alt="Zimunda Estate Logo" style="height: 80px;">
        </div>
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        <h3 style="text-align: center; color: #2196f3;">Temperature Report</h3>
        <p style="margin-bottom: 10px;">
          <strong>Period of Record:</strong> 
          ${temperatures[0].timestamp.toLocaleString()} to ${temperatures[
      temperatures.length - 1
    ].timestamp.toLocaleString()}
        </p>
        <h2 style="color: #2196f3;">Overview</h2>
        <p>
          The data provided records a series of temperature measurements over a brief period on ${new Date().toLocaleDateString()}. 
          The measurements are taken at intervals of approximately two seconds. 
          Below is a detailed summary of the recorded temperature data:
        </p>
        <h2 style="color: #2196f3;">Statistics</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <p><strong>Highest Reading:</strong> ${highestReading.toFixed(
            3
          )}°C</p>
          <p><strong>Lowest Reading:</strong> ${lowestReading.toFixed(3)}°C</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <p><strong>Average Reading:</strong> ${averageReading.toFixed(
            3
          )}°C</p>
          <p><strong>Total Readings:</strong> ${temperatures.length}</p>
        </div>
        <h2 style="color: #2196f3;">Conclusion</h2>
        <p>
          The recorded data indicates a stable temperature environment over the course of ${(
            (temperatures[temperatures.length - 1].timestamp -
              temperatures[0].timestamp) /
            1000
          ).toFixed(
            0
          )} seconds. Further monitoring over a longer period would be beneficial to confirm long-term stability and to identify any potential patterns or anomalies.
        </p>
        <p style="display: flex; justify-content: space-between;">
          <strong>Prepared by: The System</strong> 
          <span style="color: #9e9e9e;">Date: ${new Date().toLocaleDateString()}</span>
        </p>
      </div>
    `;

    return report;
  } catch (error) {
    console.error("Error generating report", error);
    throw error;
  }
}

async function sendEmailReport(toEmail) {
  const report = await generateReport();

  emailjs
    .send(
      "service_zgp0mlq",
      "template_fc944mn",
      {
        to_email: toEmail,
        subject: "Zimunda Estate Periodic Report",
        message: report,
      },
      "TjEgClr9qDWlnGWn-"
    )
    .then(
      (response) => {
        console.log("Email sent successfully:", response.status, response.text);
      },
      (error) => {
        console.error("Error sending email:", error);
      }
    );
}

setInterval(() => {
  console.log("Running scheduled task");
  sendEmailReport("tafadzwawilsonsedze@gmail.com").catch((error) =>
    console.log("Error in sending the email report: ", error)
  );
}, 604800000); // 60000 milliseconds = 1 minute so 604800000 = 1 week
