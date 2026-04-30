// listings.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
const DEFAULT_IMAGE = "../assets/placeholder-item.svg";

const container = document.getElementById("items");
const message = document.getElementById("message");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const MIN_FUZZY_SIMILARITY = 0.75;
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

function levenshteinDistance(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const row = new Array(right.length + 1);
  for (let j = 0; j <= right.length; j += 1) row[j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const tmp = row[j];
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }

  return row[right.length];
}

function similarity(a, b) {
  const aa = normalizeText(a);
  const bb = normalizeText(b);
  const maxLength = Math.max(aa.length, bb.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(aa, bb);
  return 1 - distance / maxLength;
}

function getItemScore(item, tokens, fullQuery) {
  const name = normalizeText(item.name);
  const description = normalizeText(item.description);
  const phone = normalizeText(item.phone);
  const type = normalizeText(item.type);
  const textBlob = `${name} ${description} ${phone} ${type}`;

  let score = 0;
  let matchedTokens = 0;

  if (name === fullQuery) score += 150;
  else if (name.startsWith(fullQuery)) score += 95;
  else if (name.includes(fullQuery)) score += 70;

  if (description.includes(fullQuery)) score += 30;
  if (phone.includes(fullQuery)) score += 20;
  if (type === fullQuery) score += 25;

  tokens.forEach((token) => {
    let tokenMatched = false;

    if (name.startsWith(token)) {
      score += 35;
      tokenMatched = true;
    } else if (name.includes(token)) {
      score += 20;
      tokenMatched = true;
    }

    if (description.includes(token)) {
      score += 10;
      tokenMatched = true;
    }
    if (phone.includes(token)) {
      score += 8;
      tokenMatched = true;
    }
    if (type === token) {
      score += 8;
      tokenMatched = true;
    }

    if (!tokenMatched) {
      // Basic typo tolerance against item name words.
      const words = name.split(/\s+/).filter(Boolean);
      const fuzzyHit = words.some((word) => similarity(word, token) >= MIN_FUZZY_SIMILARITY);
      if (fuzzyHit) {
        score += 12;
        tokenMatched = true;
      }
    }

    if (tokenMatched) matchedTokens += 1;
  });

  if (matchedTokens === tokens.length && tokens.length > 0) {
    score += 25;
  }

  if (tokens.length > 0 && !textBlob.includes(tokens[0]) && matchedTokens === 0) {
    return 0;
  }

  return score;
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
    message.textContent = "Search for a lost or found item above 👆";
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
  container.innerHTML = "";

  if (!searchValue) {
    message.textContent = "Search for a lost or found item above 👆";
    return;
  }

  const normalizedQuery = normalizeText(searchValue);
  const tokens = tokenize(searchValue);

  const ranked = allItems
    .map((item) => ({ item, score: getItemScore(item, tokens, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((entry) => entry.item);

  if (ranked.length === 0) {
    message.textContent = "No items found 😕";
    return;
  }

  message.textContent = `${ranked.length} result(s) found`;
  renderItems(ranked);
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