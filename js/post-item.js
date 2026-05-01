// post-item/post-item.js
import { db } from "../js/firebase.js";
import {
    addDoc,
    collection,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { requireAuth, blockBfcache } from "../js/authGuard.js";

// ── Bfcache + auth guard ──────────────────────────────────────────────────────
blockBfcache();

// Hold the authenticated user so we can attach uid to the document
let currentUser = null;
const authReady = requireAuth((user) => {
    currentUser = user;
});

// ── DOM refs ──────────────────────────────────────────────────────────────────
const form       = document.querySelector("form");
const submitBtn  = form.querySelector("button[type='submit']") || form.querySelector("button");
const imageInput = document.getElementById("image");
const typeSelect = form["type"];

const requestedType = new URLSearchParams(window.location.search).get("type");
if (typeSelect && (requestedType === "lost" || requestedType === "found")) {
    typeSelect.value = requestedType;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled    = isLoading;
    submitBtn.textContent = isLoading ? "Submitting..." : "Report";
}

function showError(message) {
    // Reuse a single inline error banner instead of stacking alerts
    let banner = document.getElementById("_formError");
    if (!banner) {
        banner = document.createElement("p");
        banner.id = "_formError";
        banner.style.cssText = "color:red; margin-top:8px; font-size:.9rem;";
        form.appendChild(banner);
    }
    banner.textContent = message;
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearError() {
    const banner = document.getElementById("_formError");
    if (banner) banner.textContent = "";
}

// ── Image upload to Cloudinary ────────────────────────────────────────────────
const CLOUDINARY_URL   = "https://api.cloudinary.com/v1_1/dxvkbjxnf/image/upload";
const UPLOAD_PRESET    = "lost_found_upload";
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES    = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function uploadImage(file) {
    // Validate before wasting a network round-trip
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Only JPEG, PNG, WEBP, or GIF images are allowed.");
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`Image must be under ${MAX_FILE_SIZE_MB} MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });

    // fetch() does NOT throw on non-2xx — check manually
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Cloudinary error ${res.status}`);
    }

    const data = await res.json();
    if (!data.secure_url) {
        throw new Error("Image upload succeeded but no URL was returned.");
    }

    return data.secure_url;
}

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    // Ensure auth state is resolved before writing ownership fields.
    await authReady;

    const name        = form["item-name"].value.trim();
    const description = form["Description"].value.trim();
    const type        = form["type"].value;
    const phone       = form["phone-number"].value.trim();
    const location    = form["location"].value.trim();
    const file        = imageInput.files[0];

    // Client-side validation
    if (!name) {
        showError("Item name is required.");
        return;
    }
    if (!type) {
        showError("Please select Lost or Found.");
        return;
    }
    if (phone && !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
        showError("Please enter a valid phone number.");
        return;
    }

    setLoading(true);

    try {
        // STEP A: Upload image (optional)
        let imageUrl = "";
        if (file) {
            imageUrl = await uploadImage(file);
        }

        // STEP B: Save to Firestore
        await addDoc(collection(db, "items"), {
            name,
            description,
            type,
            image:        imageUrl,
            phone,
            location,
            postedBy:     currentUser?.uid   ?? null,  // ownership tracking
            postedByEmail: currentUser?.email ?? null,
            createdAt:    serverTimestamp(),            // server time, not client clock
        });

        form.reset();
        // replace() removes this page from history — back button won't return to blank form
        window.location.replace("../pages/dashboard.html");

    } catch (error) {
        console.error("Post item error:", error);
        showError(error.message || "Something went wrong. Please try again.");
        setLoading(false); // re-enable only on failure; success navigates away
    }
});
