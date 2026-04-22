import { db } from "./firebase.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const container = document.getElementById("items");

const snapshot = await getDocs(collection(db, "items"));

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

