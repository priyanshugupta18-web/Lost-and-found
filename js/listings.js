import { db } from "./firebase.js";
import {
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const container = document.getElementById("items");
const message = document.getElementById("message");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// 🔍 Search function
async function searchItems() {
  const searchValue = searchInput.value.trim();

  container.innerHTML = ""; // clear previous results

  if (!searchValue) {
    message.textContent = "Please enter something to search.";
    return;
  }

  message.textContent = "Searching...";

  try {
    const q = query(
      collection(db, "items"),
      where("name", ">=", searchValue),
      where("name", "<=", searchValue + "\uf8ff")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      message.textContent = "No items found 😕";
      return;
    }

    message.textContent = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      container.innerHTML += `
        <div class="card">
          <img 
            src="../assets/preview.webp" 
            class="thumb"
            data-url="${data.image}"
          />

          <h3>${data.name}</h3>
          <p>${data.description}</p>
          <p>Contact at: ${data.phone}</p>

          <span class="badge ${data.type}">
            ${data.type.toUpperCase()}
          </span>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    message.textContent = "Error fetching data";
  }
}

// 🔘 Button click
searchBtn.addEventListener("click", searchItems);

// ⌨️ Enter key support
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchItems();
  }
});

// 🖼️ Image click
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("thumb")) {
    const url = e.target.dataset.url;

    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No image available");
    }
  }
});
