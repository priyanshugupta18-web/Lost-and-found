import { auth } from "../js/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const loginBtn = document.getElementById("login");
  const signupBtn = document.getElementById("signup");
  const googleBtn = document.getElementById("googleBtn");
  const DASHBOARD_URL = "../pages/dashboard.html";

  if (!email || !password || !loginBtn || !signupBtn || !googleBtn) {
    console.error("Auth page elements missing. Check IDs in auth.html.");
    alert("Auth page is not initialized correctly. Please refresh.");
    return;
  }

  function redirectToDashboard() {
    window.location.href = DASHBOARD_URL;
  }

  function getFriendlyAuthError(err) {
    switch (err?.code) {
      case "auth/popup-blocked":
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Popup blocked/closed. Retrying with redirect sign-in...";
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Auth. Add it under Authentication > Settings > Authorized domains.";
      case "auth/operation-not-allowed":
        return "Google sign-in is disabled in Firebase console. Enable Google provider in Authentication > Sign-in method.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection and try again.";
      default:
        return err?.message || "Authentication failed. Please try again.";
    }
  }

  // If user returned from Google redirect flow, complete sign-in.
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) redirectToDashboard();
    })
    .catch((err) => {
      console.error("Google redirect error:", err);
      alert(getFriendlyAuthError(err));
    });

  signupBtn.addEventListener("click", async (event) => {
    event.preventDefault();
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

  loginBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!email.value || !password.value) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      redirectToDashboard();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  googleBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    googleBtn.disabled = true;
    try {
      await signInWithPopup(auth, provider);
      redirectToDashboard();
    } catch (err) {
      console.error("Google popup error:", err);
      const shouldFallbackToRedirect = [
        "auth/popup-blocked",
        "auth/popup-closed-by-user",
        "auth/cancelled-popup-request",
      ].includes(err?.code);

      if (shouldFallbackToRedirect) {
        alert(getFriendlyAuthError(err));
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          console.error("Google redirect start error:", redirectErr);
          alert(getFriendlyAuthError(redirectErr));
        }
      } else {
        alert(getFriendlyAuthError(err));
      }
    } finally {
      googleBtn.disabled = false;
    }
  });

});
