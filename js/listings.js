// listings.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const DEFAULT_IMAGE = "../assets/placeholder-item.svg";
const DEFAULT_VISIBLE_ITEMS = 10;
const SEARCH_RESULT_LIMIT = DEFAULT_VISIBLE_ITEMS;

const container  = document.getElementById("items");
const message    = document.getElementById("message");
const searchBtn  = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

let allItems   = [];
let isLoaded   = false;
let loadFailed = false;

if (!container || !message || !searchBtn || !searchInput) {
  throw new Error("Listings page is missing required DOM elements.");
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
  const haystack = getSearchText(item);
  return tokens.every((token) => haystack.includes(token));
}

function getSearchText(item) {
  return [
    normalizeText(item.name),
    normalizeText(item.description),
    normalizeText(item.phone),
    normalizeText(item.type),
    normalizeText(item.location),
  ].join(" ");
}

function getSearchScore(item, tokens) {
  const name = normalizeText(item.name);
  const type = normalizeText(item.type);
  const description = normalizeText(item.description);
  let score = 0;

  tokens.forEach((token) => {
    if (name === token) score += 50;
    else if (name.startsWith(token)) score += 30;
    else if (name.includes(token)) score += 20;

    if (type === token) score += 10;
    if (description.includes(token)) score += 5;
  });

  return score;
}

function getSearchResults(items, tokens, limit = SEARCH_RESULT_LIMIT) {
  return items
    .filter((item) => matchesQuery(item, tokens))
    .sort((a, b) => {
      const scoreDiff = getSearchScore(b, tokens) - getSearchScore(a, tokens);
      if (scoreDiff !== 0) return scoreDiff;
      return getTimestampValue(b) - getTimestampValue(a);
    })
    .slice(0, limit);
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
    image.onerror = () => { image.src = DEFAULT_IMAGE; };

    const title = document.createElement("h3");
    title.textContent = String(data.name ?? "Untitled item");

    const description = document.createElement("p");
    description.textContent = String(data.description ?? "");

    const cardInfo = document.createElement("div");
    cardInfo.className = "card-info";

    const contact = document.createElement("span");
    contact.className = "info-item";
    contact.innerHTML = `<span class="info-icon">&#128241;</span>${data.phone || "N/A"}`;

    cardInfo.appendChild(contact);

    if (data.location) {
      const locationEl = document.createElement("span");
      locationEl.className = "info-item";
      locationEl.innerHTML = `<span class="info-icon">&#128205;</span>${data.location}`;
      cardInfo.appendChild(locationEl);
    }

    const badge = document.createElement("span");
    const normalizedType = data.type === "lost" || data.type === "found" ? data.type : "";
    badge.className = `badge${normalizedType ? ` ${normalizedType}` : ""}`;
    badge.textContent = normalizedType ? normalizedType.toUpperCase() : "";

    card.append(image, title, description, cardInfo, badge);
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

    // ✅ Fixed: was missing closing ) on this line
    allItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    isLoaded = true;
    console.log("[listings] items fetched:", allItems.length);

    const latest = getLatestItems(allItems);
    if (latest.length === 0) {
      message.textContent = "No items posted yet.";
      container.innerHTML = "";
    } else {
      message.textContent = `Showing latest ${latest.length} item(s)`;
      console.log("[listings] rendering", latest.length, "items");
      try { renderItems(latest); } catch(renderErr) { console.error("[listings] renderItems crashed:", renderErr); }
    }
  } catch (error) {
    console.error("Listings load error:", error);
    loadFailed = true;
    const errCode = error && error.code ? error.code : "";
    if (errCode === "permission-denied") {
      message.textContent = "Access denied - please log in first.";
    } else if (errCode === "unavailable") {
      message.textContent = "Network unavailable. Check your connection and refresh.";
    } else {
      message.textContent = "Could not load items (" + (errCode || (error && error.message) || "unknown") + "). Please refresh.";
    }
  } finally {
    searchBtn.disabled = false;
  }
}

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
  const results = getSearchResults(allItems, tokens);

  if (results.length === 0) {
    message.textContent = "No items found 😕";
    container.innerHTML = "";
    return;
  }

  message.textContent = `${results.length} result(s) found`;
  renderItems(results);
}

// Initial load
console.log("[listings] script started");
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
