// dashboard/dashboard.js
import { signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import {
    getDocs,
    collection,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { auth, db } from "../js/firebase.js";
import { requireAuth, blockBfcache } from "../js/authGuard.js";

// ── Prevent bfcache from bypassing the auth check ────────────────────────────
blockBfcache();

// ── DOM refs ──────────────────────────────────────────────────────────────────
const nameDisplay = document.getElementById("userNameDisplay");
const avatar      = document.getElementById("userAvatar");
const greeting    = document.getElementById("welcomeGreeting");
const status      = document.getElementById("statusMessage");
const profile     = document.getElementById("profileArea");
const dropdown    = document.getElementById("dropdown");
const logoutBtn   = document.getElementById("logoutBtn");
const statTotal   = document.getElementById("statTotal");
const statLost    = document.getElementById("statLost");
const statFound   = document.getElementById("statFound");

// ── Show shimmer placeholders while loading ───────────────────────────────────
function setShimmer(el) {
    if (el) el.innerHTML = '<span class="stat-shimmer"></span>';
}

[statTotal, statLost, statFound].forEach(setShimmer);

// ── Fetch real stats from Firestore ───────────────────────────────────────────
async function loadStats() {
    try {
        const itemsRef = collection(db, "items");

        const [allSnap, lostSnap, foundSnap] = await Promise.all([
            getDocs(itemsRef),
            getDocs(query(itemsRef, where("type", "==", "lost"))),
            getDocs(query(itemsRef, where("type", "==", "found"))),
        ]);

        if (statTotal) statTotal.textContent = allSnap.size;
        if (statLost)  statLost.textContent  = lostSnap.size;
        if (statFound) statFound.textContent = foundSnap.size;
    } catch (err) {
        console.error("Failed to load stats:", err);
        if (statTotal) statTotal.textContent = "-";
        if (statLost)  statLost.textContent  = "-";
        if (statFound) statFound.textContent = "-";
    }
}

// ── Auth guard — populates UI once user is confirmed ─────────────────────────
requireAuth((user) => {
    const fallbackName = user.email ? user.email.split("@")[0] : "User";
    const name = user.displayName || fallbackName;

    if (nameDisplay) nameDisplay.innerText = name;
    if (avatar)      avatar.innerText      = name[0].toUpperCase();
    if (greeting)    greeting.innerText    = `Hi, ${name} 👋`;
    if (status)      status.innerText      = "Welcome back!";

    // Load stats after auth is confirmed
    loadStats();
});

// ── Profile dropdown ──────────────────────────────────────────────────────────
if (profile && dropdown) {
    profile.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });
}

document.addEventListener("click", () => {
    if (dropdown) dropdown.classList.remove("show");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown) dropdown.classList.remove("show");
});

// ── Logout ────────────────────────────────────────────────────────────────────
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        logoutBtn.disabled    = true;
        logoutBtn.textContent = "Logging out…";

        try {
            await signOut(auth);
            window.location.replace("../pages/auth.html");
        } catch (error) {
            console.error("Logout error:", error);
            logoutBtn.disabled    = false;
            logoutBtn.textContent = "Logout";
        }
    });
} else {
    console.warn("Logout button not found");
}
