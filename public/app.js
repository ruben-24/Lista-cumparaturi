// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhN-DQQqWLo7s2SHMEHbp67P7mPqips3k",
  authDomain: "lista--cumparaturi.firebaseapp.com",
  databaseURL: "https://lista--cumparaturi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lista--cumparaturi",
  storageBucket: "lista--cumparaturi.appspot.com",
  messagingSenderId: "1017722987139",
  appId: "1:1017722987139:web:9a00866e9b5ace247131b6",
  measurementId: "G-045KJZYQ9T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM
const formProdus = document.getElementById("formProdus");
const inputProdus = document.getElementById("inputProdus");
const msgStatus = document.getElementById("msgStatus");
const clearCheckedBtn = document.getElementById("clearChecked");
const magazinSelect = document.getElementById("magazinSelect");

const tabs = {
  general: document.getElementById("lista-general"),
  aldi: document.getElementById("lista-aldi"),
  dm: document.getElementById("lista-dm"),
  freesnapf: document.getElementById("lista-freesnapf"),
  rossmann: document.getElementById("lista-rossmann"),
  kaufland: document.getElementById("lista-kaufland"),
  lidl: document.getElementById("lista-lidl"),
};

// Categorii
const categorii = {
  "Legume & Fructe": ["rosie","mere","banane","castravete","morcov","ceapa","cartof","salata","ardei","pepene","varza","usturoi","lămâie","avocado"],
  "Lactate": ["lapte","iaurt","branza","unt","smantana","cascaval"],
  "Carne & Pește": ["carne","pui","vita","somon","ton","oua"],
  "Panificație": ["paine","corn","bagheta","chifle"],
  "Băuturi": ["apa","suc","bere","vin","ceai","cafea"],
  "Condimente & Uleiuri": ["sare","piper","ulei","otet","sos","miere","mustar"]
};

// Form submit
formProdus.addEventListener("submit", e => {
  e.preventDefault();
  const shop = magazinSelect.value;
  const text = inputProdus.value.trim();
  if (!text) return;
  addProdus(shop, text);
  inputProdus.value = "";
});

// Adaugă produs
function addProdus(shop, text) {
  const newRef = ref(db, `products/${shop}`);
  push(newRef, { name: text });
  msgStatus.textContent = `Produs adăugat la ${shop}`;
  msgStatus.style.opacity = 1;
  setTimeout(() => msgStatus.style.opacity = 0, 2000);
}

// Render
function renderList(shop) {
  const listaDiv = tabs[shop];
  const shopRef = ref(db, `products/${shop}`);
  onValue(shopRef, snapshot => {
    const data = snapshot.val() || {};
    const items = Object.entries(data).map(([id, val]) => ({ id, ...val }));

    // Categorize
    const categorized = {};
    items.forEach(item => {
      let found = false;
      for (const cat in categorii) {
        if (categorii[cat].some(word => item.name.toLowerCase().includes(word))) {
          categorized[cat] = categorized[cat] || [];
          categorized[cat].push(item);
          found = true;
          break;
        }
      }
      if (!found) {
        categorized["Altele"] = categorized["Altele"] || [];
        categorized["Altele"].push(item);
      }
    });

    listaDiv.innerHTML = "";
    for (const cat in categorized) {
      const card = document.createElement("div");
      card.className = "categorie-card";
      const h3 = document.createElement("h3");
      h3.textContent = cat;
      card.appendChild(h3);
      const ul = document.createElement("ul");
      categorized[cat].forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        const btn = document.createElement("button");
        btn.textContent = "Șterge";
        btn.className = "btn-del";
        btn.onclick = () => {
          const itemRef = ref(db, `products/${shop}/${item.id}`);
          remove(itemRef);
        };
        li.appendChild(btn);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      listaDiv.appendChild(card);
    }
  });
}

// Clear all
clearCheckedBtn.addEventListener("click", () => {
  const shop = magazinSelect.value;
  const shopRef = ref(db, `products/${shop}`);
  remove(shopRef);
});

// Schimbă magazin
magazinSelect.addEventListener("change", () => {
  const shop = magazinSelect.value;
  for (const key in tabs) {
    tabs[key].parentElement.style.display = key === shop ? "block" : "none";
  }
  renderList(shop);
});

// Init
renderList("general");
