import { db } from "./firebase.js";
import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //Get form values
  const name = form["item-name"].value;
  const description = form["Description"].value;
  const type = form["type"].value;
  const file = document.getElementById("image").files[0];
  const phone = form["phone-number"].value;

  let imageUrl = "";

  try {
    //STEP A: Upload image to Cloudinary
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "lost_found_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxvkbjxnf/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    //STEP B: Save data to Firebase
    await addDoc(collection(db, "items"), {
      name: name,
      description: description,
      type: type,
      image: imageUrl,
      phone: phone,
      createdAt: new Date(),
    });

    alert("Item reported successfully!");
    form.reset();
    document.location.href = "../pages/dashboard.html";
  } 
  catch (error) {
    console.error(error);
    alert("Error occurred!");
  }
});
