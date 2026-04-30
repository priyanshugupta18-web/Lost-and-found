// listings.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
const DEFAULT_IMAGE = "../assets/placeholder-item.svg";
const DEFAULT_VISIBLE_ITEMS = 10;

const container = document.getElementById("items");
const message = document.getElementById("message");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
let allItems = [];
let isLoaded = false;
let loadFailed = false;

if (!container || !message || !searchBtn || !searchInput) {
  throw new Error("Listings page is missing required DOM elements.");
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter(Boolean);
}

function getTimestampValue(item) {
  const raw = item.createdAt;
  if (!raw) return 0;
  if (typeof raw.toMillis === "function") return raw.toMillis();
  if (raw.seconds) return raw.seconds * 1000;
  return 0;
}

function getLatestItems(items, limit = DEFAULT_VISIBLE_ITEMS) {
  return [...items]
    .sort((a, b) => getTimestampValue(b) - getTimestampValue(a))
    .slice(0, limit);
}

function matchesQuery(item, tokens) {
  if (tokens.length === 0) return true;
  const name = normalizeText(item.name);
  const description = normalizeText(item.description);
  const phone = normalizeText(item.phone);
  const type = normalizeText(item.type);
  const haystack = `${name} ${description} ${phone} ${type}`;
  return tokens.every((token) => haystack.includes(token));
}

function renderItems(items) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((data) => {
    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.className = "thumb";
    image.src = data.image || DEFAULT_IMAGE;
    image.dataset.url = data.image ?? "";
    image.alt = String(data.name ?? "Item image");
    image.onerror = () => {
      image.src = DEFAULT_IMAGE;
    };

    const title = document.createElement("h3");
    title.textContent = String(data.name ?? "Untitled item");

    const description = document.createElement("p");
    description.textContent = String(data.description ?? "");

    const contact = document.createElement("p");
    contact.textContent = `Contact at: ${data.phone ?? "N/A"}`;

    const badge = document.createElement("span");
    const normalizedType = data.type === "lost" || data.type === "found" ? data.type : "";
    badge.className = `badge${normalizedType ? ` ${normalizedType}` : ""}`;
    badge.textContent = normalizedType ? normalizedType.toUpperCase() : "";

    card.append(image, title, description, contact, badge);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

async function loadItems() {
  if (isLoaded) return;
  loadFailed = false;
  message.textContent = "Loading items...";
  searchBtn.disabled = true;

  try {
    const snapshot = await getDocs(collection(db, "items"));
    allItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    });
    isLoaded = true;
    const latest = getLatestItems(allItems);
    if (latest.length === 0) {
      message.textContent = "No items posted yet.";
      container.innerHTML = "";
    } else {
      message.textContent = `Showing latest ${latest.length} item(s)`;
      renderItems(latest);
    }
  } catch (error) {
    console.error("Listings load error:", error);
    loadFailed = true;
    message.textContent = "Could not load items (check Firestore rules/network). Please refresh and try again.";
  } finally {
    searchBtn.disabled = false;
  }
}

// 🔍 Search function
async function searchItems() {
  const searchValue = searchInput.value.trim();

  if (!isLoaded) await loadItems();
  if (loadFailed) return;

  if (!searchValue) {
    const latest = getLatestItems(allItems);
    if (latest.length === 0) {
      message.textContent = "No items posted yet.";
      container.innerHTML = "";
    } else {
      message.textContent = `Showing latest ${latest.length} item(s)`;
      renderItems(latest);
    }
    return;
  }

  const tokens = tokenize(searchValue);
  const results = getLatestItems(allItems.filter((item) => matchesQuery(item, tokens)), 20);

  if (results.length === 0) {
    message.textContent = "No items found 😕";
    container.innerHTML = "";
    return;
  }

  message.textContent = `${results.length} result(s) found`;
  renderItems(results);
}

loadItems();

// 🔘 Button click
searchBtn.addEventListener("click", searchItems);

// ⌨️ Enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchItems();
});

// 🖼️ Image click
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("thumb")) {
    const url = e.target.dataset.url;
    url ? window.open(url, "_blank") : alert("No image available");
  }
});