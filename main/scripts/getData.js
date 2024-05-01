// JavaScript
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpAI_F_qNfdqr8SmNXlmUIIzrfLGLBfxk",
  authDomain: "zimunda-smart-farm-project.firebaseapp.com",
  databaseURL: "https://zimunda-smart-farm-project-default-rtdb.firebaseio.com",
  projectId: "zimunda-smart-farm-project",
  storageBucket: "zimunda-smart-farm-project.appspot.com",
  messagingSenderId: "1018586661772",
  appId: "1:1018586661772:web:b82e5142e2068e8aa90ca9",
};

// Initialize Firebase app
initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase();

function getDatabaseJSON(dataPath) {
  return new Promise((resolve, reject) => {
    get(ref(database, dataPath))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          resolve(data);
        } else {
          console.warn("No data found at the specified path:", dataPath);
          resolve({}); // Resolve with an empty object if no data exists
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}

const getDataBtn = document.querySelector(".getData");

getDataBtn.addEventListener("click", () => {
  const dataPath = "/"; // Replace with the desired path in your database

  getDatabaseJSON(dataPath)
    .then((data) => {
      const jsonData = JSON.stringify(data, null, 2); // Format JSON for readability

      const blob = new Blob([jsonData], { type: "text/json;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading data:", error);
      // Handle errors appropriately (e.g., display an error message)
    });
});

/*
getDataBtn.addEventListener("click", function () {
  getDatabaseJSON("/")
    .then((data) => {
      console.log("Fetched data in JSON format:", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
*/
