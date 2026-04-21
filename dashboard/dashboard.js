import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import { auth } from "../js/firebase.js";

// Elements
const nameDisplay = document.getElementById("userNameDisplay");
const avatar = document.getElementById("userAvatar");
const greeting = document.getElementById("welcomeGreeting");
const status = document.getElementById("statusMessage");

const profile = document.getElementById("profileArea");
const dropdown = document.getElementById("dropdown");
const logoutBtn = document.getElementById("logoutBtn");

// AUTH CHECK
onAuthStateChanged(auth, (user) => {
    if (user) {
        const name = user.displayName || user.email.split("@")[0];

        nameDisplay.innerText = name;
        avatar.innerText = name[0].toUpperCase();

        greeting.innerText = `Hi, ${name} 👋`;
        status.innerText = "Welcome back!";

    } else {
        window.location.href = "../pages/auth.html";
    }
});

// DROPDOWN
profile.addEventListener("click", () => {
    dropdown.classList.toggle("show");
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../pages/auth.html";
});
