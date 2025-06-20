// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore,collection,addDoc,onSnapshot,deleteDoc, doc, enableIndexedDbPersistence} from  "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAd2KbYB1-Ph7MgQp5y5NR-25wVVAHdSjc",
    authDomain: "pwa25-301e7.firebaseapp.com",
    projectId: "pwa25-301e7",
    storageBucket: "pwa25-301e7.firebasestorage.app",
    messagingSenderId: "371216089726",
    appId: "1:371216089726:web:62c9658bc7c2b64507ce2f"
};


// Initialize Firebase
const app = await initializeApp(firebaseConfig);
const db = await getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.log("Multiple tabs open");
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.error("browser does not support required features");
    }
});

const form = document.querySelector('form');
form.addEventListener('submit', async evt => {
   evt.preventDefault();
   const contact = {
       name: form.title.value,
       contactnumber: form.numbers.value
   }
   await addDoc(collection(db, 'contacts'),contact);
   form.title.value = '';
   form.numbers.value = '';
});

const contactContainer = document.querySelector(".contacts");
contactContainer.addEventListener("click",async evt => {
    if (evt.target.tagName === "I") {
        const id = evt.target.getAttribute('data-id');
        await deleteDoc(doc(db, 'contacts', id));
    }
})

onSnapshot(collection(db,'contacts'),(snapshot) => {
    snapshot.docChanges().forEach(change => {
        if(change.type === "added"){
            renderContact(change.doc.data(),change.doc.id);
        } else if (change.type === "removed"){
            removeContact(change.doc.id);
        }
    })
});

function renderContact(data, id) {
    const html = `
  <div class="grey-text text-darken-1 kwm-contact">
      <div class="contact-image">
        <img src="img/kwmcontacts.png" alt="contact thumb">
      </div>
      <div class="contact-details">
        <div class="contact-title">${data.name}</div>
        <div class="contact-numbers">${data.contactnumber}</div>
      </div>
      <div class="contact-options">        
        <i class="material-icons">call</i>              
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>`;

    const contacts = document.querySelector('.contacts');
    contacts.insertAdjacentHTML("beforeend", html);
}

function removeContact(id){
    const icon = document.querySelector("[data-id='"+id+"']");
    let contactToRemove = icon.closest(".kwm-contact");
    console.log(contactToRemove);
    contactToRemove.remove();
}