const { default: Swal } = require("sweetalert2");
import swal from "sweetalert";
 
function toggleNav() {
  var navToggle = document.getElementById("nav-toggle");
  navToggle.checked = !navToggle.checked;
}

const currentDate = new Date();

// Array of month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Format date as "DD Month YYYY"
const day = currentDate.getDate();
const month = monthNames[currentDate.getMonth()];
const year = currentDate.getFullYear();

document.querySelector(".currentDate").innerText = `${day} ${month} ${year}`;

function toggleWeatherContainer() {
  const weatherContainer = document.querySelector(".weather-modal");
  weatherContainer.style.display =
    weatherContainer.style.display === "none" ? "block" : "none";
}
