import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

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

function getDatabaseJSON(dataPath) {
  return new Promise((resolve, reject) => {
    get(ref(database, dataPath))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          resolve(data);
        } else {
          Swal.fire(
            "No data found",
            "No data found at the specified path: " + dataPath,
            "error"
          );
          resolve({});
        }
      })
      .catch((error) => {
        Swal.fire("Error fetching Data", error, "error");
        reject(error);
      });
  });
}

async function generateReportAndPrompt() {
  const dataPath = "/";
  try {
    const data = await getDatabaseJSON(dataPath);
    const jsonData = JSON.stringify(data, null, 2);

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

    /* =============== REPORT ==================== */
    const report = `
  <div style="
    font-family: Arial, sans-serif;
    border-radius: 5px;
    height: auto;
  ">

    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; flex-direction: column; align-items: start;">
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
      <p><strong>Highest Reading:</strong> ${highestReading.toFixed(3)}°C</p>
      <p><strong>Lowest Reading:</strong> ${lowestReading.toFixed(3)}°C</p>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <p><strong>Average Reading:</strong> ${averageReading.toFixed(3)}°C</p>
      <p><strong>Total Readings:</strong> ${temperatures.length}</p>
    </div>

    <h2 style="color: #2196f3;">Initial Readings:</h2>

    <p><strong>Timestamp:</strong> ${temperatures[0].timestamp.toLocaleString()}</p>
    <p><strong>Temperature:</strong> <span class="math-inline">\{temperatures\[0\]\.temperature\.toFixed\(3\)\}°C</p\>
<p style\="color\: \#2196f3;"\><strong\>Subsequent Readings\:</strong\></p\>
<h2 style\="color\: \#2196f3;"\>Analysis</h2\>
<p\><strong\>Consistency in Temperature\:</strong\></p\>
<p\>
The majority of the temperature readings \(</span>{
        temperatures.filter((r) => r.temperature === temperatures[0].temperature).length
      }) are consistently recorded at ${temperatures[0].temperature.toFixed(
        3
      )}°C. 
      ${
        temperatures.filter(
          (r) => r.temperature !== temperatures[0].temperature
        ).length > 0
          ? `Only ${
              temperatures.filter(
                (r) => r.temperature !== temperatures[0].temperature
              ).length
            } readings show a slight variation.`
          : "No variations recorded."
      }
    </p>
    <p>
      <strong>Stability:</strong> The temperature shows ${isStable(
        temperatures[0].temperature
      )} stability with minimal fluctuation over the recorded period.
    </p>
    <p>
      <strong>Temporal Distribution:</strong> The readings are evenly spaced, each approximately two seconds apart, providing a reliable sequence of data points for the given timeframe.
    </p>

    <h2 style="color: #2196f3;">Conclusion</h2>

    <p>
      The recorded data indicates a ${isStable(
        temperatures[0].temperature
      )} temperature environment over the course of ${(
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

    Swal.fire({
      title: "Report Generated",
      text: "Do you want to download or print the report?",
      showCancelButton: true,
      confirmButtonText: "Download / PDF",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Download Complete!", "", "success");
        setTimeout(() => {
          const pdfBlob = htmlToPdf(report);
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = "temperature_report.pdf";
          link.click();
        }, 3000);
      }
    });
    let progressContainer = document.getElementById("progress-bar");
    progressContainer.style.display = "none";
  } catch (error) {
    Swal.fire(
      "Error",
      "An error occurred while generating the report.",
      "error"
    );
  }
}

function isStable(temp) {
  if (temp >= 28) {
    return "high";
  } else if (temp <= 15) {
    return "low";
  } else {
    return "stable";
  }
}

function htmlToPdf(html) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.onload = () => {
      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow.print();
        resolve(iframe.contentDocument);
        document.body.removeChild(iframe);
      }, 500);
    };
  });
}

document
  .querySelector(".generateReport")
  .addEventListener("click", generateReportAndPrompt);
