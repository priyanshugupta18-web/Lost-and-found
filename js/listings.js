// listings.js
import algoliasearch from "https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.esm.browser.js";

const algoliaDefaults = {
  appId: "E8CKULBYXW",
  searchKey: "070aef38b35761aa7a43f414998223ea",
  index: "items",
};

const runtimeAlgoliaConfig = window.LOST_FOUND_CONFIG?.algolia || {};
const algoliaConfig = { ...algoliaDefaults, ...runtimeAlgoliaConfig };

const ALGOLIA_APP_ID = algoliaConfig.appId;
const ALGOLIA_SEARCH_KEY = algoliaConfig.searchKey;
const ALGOLIA_INDEX = algoliaConfig.index;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = client.initIndex(ALGOLIA_INDEX);
const DEFAULT_IMAGE = "../assets/placeholder-item.svg";

const container = document.getElementById("items");
const message = document.getElementById("message");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (!container || !message || !searchBtn || !searchInput) {
  throw new Error("Listings page is missing required DOM elements.");
}

// 🔍 Search function
async function searchItems() {
  const searchValue = searchInput.value.trim();

  container.innerHTML = "";

  if (!searchValue) {
    message.textContent = "Search for a lost or found item above 👆";
    return;
  }

  message.textContent = "Searching...";

  try {
    const { hits } = await index.search(searchValue, {
      attributesToRetrieve: ["name", "description", "phone", "type", "image"],
      hitsPerPage: 20,
    });

    if (hits.length === 0) {
      message.textContent = "No items found 😕";
      return;
    }

    message.textContent = `${hits.length} result(s) found`;

    const fragment = document.createDocumentFragment();

    hits.forEach((data) => {
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

  } catch (error) {
    console.error("Algolia error:", error);
    message.textContent = "Error fetching results. Check your Algolia config.";
  }
}

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