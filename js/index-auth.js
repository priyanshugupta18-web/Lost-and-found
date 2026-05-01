import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const navGuest = document.getElementById("nav-guest");
const navUser  = document.getElementById("nav-user");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;

// Resolves exactly once — as soon as Firebase knows the auth state.
// Subsequent clicks reuse the already-resolved promise (instant).
let resolveAuth;
const authReady = new Promise((res) => { resolveAuth = res; });

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  setAuthNav(Boolean(user));
  resolveAuth(user);   // safe to call multiple times; promise only resolves once
});

function setAuthNav(isLoggedIn) {
  if (navGuest) navGuest.style.display = isLoggedIn ? "none" : "flex";
  if (navUser)  navUser.style.display  = isLoggedIn ? "flex"  : "none";
}

// ── Guard every link that leads to the report form ───────────────────────────
// Covers: hero "Report lost item", hero "Post found item", footer "Post Item"
document.querySelectorAll('a[href*="post-item.html"]').forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();

    await authReady;          // wait for Firebase — usually already resolved

    if (currentUser) {
      window.location.href = link.href;   // logged in  → go to the form
    } else {
      window.location.href = "pages/auth.html";  // not logged in → login page
    }
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────
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
