import { auth } from "../js/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const loginBtn = document.getElementById("login");
  const signupBtn = document.getElementById("signup");
  const googleBtn = document.getElementById("googleBtn");

  signupBtn.addEventListener("click", async () => {
    if (!email.value || !password.value) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert("Account created!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  loginBtn.addEventListener("click", async () => {
    if (!email.value || !password.value) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  const provider = new GoogleAuthProvider();

  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);

      if (err.code === "auth/popup-blocked") {
        alert("Enable popups for Google login");
      } else {
        alert(err.message);
      }
    }
  });

});
