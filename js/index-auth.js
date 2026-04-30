import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const navGuest = document.getElementById("nav-guest");
const navUser = document.getElementById("nav-user");
const logoutBtn = document.getElementById("logout-btn");

function setAuthNav(isLoggedIn) {
  if (navGuest) navGuest.style.display = isLoggedIn ? "none" : "flex";
  if (navUser) navUser.style.display = isLoggedIn ? "flex" : "none";
}

onAuthStateChanged(auth, (user) => {
  setAuthNav(Boolean(user));
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out right now. Please try again.");
    }
  });
}
