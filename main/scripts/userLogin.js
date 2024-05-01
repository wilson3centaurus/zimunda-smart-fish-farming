import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import Swal from "sweetalert2";

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

const signupBtn = document.querySelector(".signUp");

signupBtn.addEventListener("click", (e) => {
  let username = document.querySelector("#logname").value;
  let email = document.querySelector("#signemail").value;
  let password = document.querySelector("#signpass").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;

      set(ref(database, "users/" + user.uid), {
        username: username,
        email: email,
      });

      alert("User Created");
      clearFields();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode + " : " + " " + errorMessage);
    });
});


function runMe() {
  Swal.fire("Hello world!");
}

const loginBtn = document.querySelector(".login");

loginBtn.addEventListener("click", (e) => {
  let email = document.querySelector("#logemail").value;
  let password = document.querySelector("#logpass").value;
  //let email = document.querySelector("#signemail").value;
  //let password = document.querySelector("#signpass").value;
  
  //const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;

      const todayDate = new Date();
      update(ref(database, "users/" + user.uid), {
        last_login: todayDate,
      });

      Swal.fire("Hey user!", "You are the rockstar!", "info");
      alert("Login Sucessful!");
      
      clearFields();
    })
    .catch((error) => {
      // Handle login errors
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode + " : " + " " + errorMessage);
    });
});

function clearFields() {
  document.querySelector("#logname").value = "";
  document.querySelector("#signemail").value = "";
  document.querySelector("#signpass").value = "";
}