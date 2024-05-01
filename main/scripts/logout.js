import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Logout
const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      Swal.fire({
        title: "Are you sure?",
        text: "Are really really really sure you want to logout!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Logged Out!",
            text: "You are now logged out.",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "http://127.0.0.1:5501/main/userLogin.html";
          }, 4000);
          //window.location.href = "http://127.0.0.1:5501/main/userLogin.html";
        }
      });
    })
    .catch((error) => {
      // An error on signout.
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Hold on tight...",
      });
    });
});
