// js/authGuard.js
// Import this on EVERY protected page. It redirects unauthenticated users
// and also handles the back-button / bfcache bypass.

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { auth } from "../js/firebase.js";

/**
 * Guards a page so only authenticated users can view it.
 *
 * @param {function(import("firebase/auth").User): void} [onUser]
 *   Optional callback invoked with the Firebase User once auth is confirmed.
 *   Use this to populate UI (name, avatar, etc.) instead of calling
 *   onAuthStateChanged a second time in your page script.
 *
 * @returns {Promise<import("firebase/auth").User>}
 *   Resolves with the authenticated user, or never resolves if redirecting.
 */
export function requireAuth(onUser) {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // We only need one check at page load

            if (!user) {
                // Kill any cached version of this page so back-button won't serve it
                // Setting location.replace removes this page from history stack
                window.location.replace("../pages/auth.html");
                return; // Promise never resolves → page JS halts naturally
            }

            if (typeof onUser === "function") onUser(user);
            resolve(user);
        });
    });
}

/**
 * Prevents the bfcache (back/forward cache) from serving a stale,
 * pre-auth-check snapshot of the page.
 *
 * Call this once at module load on every protected page.
 * It forces a fresh load whenever the page is restored from bfcache,
 * which triggers onAuthStateChanged again and redirects if logged out.
 */
export function blockBfcache() {
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            // Page was served from bfcache — force a real reload so the
            // auth guard above runs again
            window.location.reload();
        }
    });

    // Also mark the page as non-cacheable at the fetch level
    // (belt-and-suspenders alongside the meta tags in HTML)
    if ("caches" in window) {
        caches.keys().then((keys) =>
            keys.forEach((key) => caches.delete(key))
        );
    }
}