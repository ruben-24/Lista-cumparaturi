// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Config Firebase (înlocuiește cu datele tale)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Select DOM elements
const formProdus = document.getElementById("formProdus");
const inputProdus = document.getElementById("inputProdus");
const msgStatus = document.getElementById("msgStatus");
const listaGeneral = document.getElementById("lista");
const listaLidl = document.getElementById("lista-lidl");
const listaKaufland = document.getElementById("lista-kaufland");
const clearCheckedBtn = document.getElementById("clearChecked");

// Categorie keywords
const categorii = {
  "Legume & Fructe": ["rosie","mere","banane","castravete","morcov","ceapa","cartof","salata","ardei","pepene","varza","usturoi","lămâie","avocado"],
  "Lactate": ["lapte","iaurt","branza","unt","smantana","cascaval"],
  "Carne & Pește": ["carne tocata","pui","vita","somon","ton","oua"],
  "Panificație": ["paine","corn","bagheta","chifle"],
  "Băuturi": ["apa","suc","bere","vin","ceai","cafea"],
  "Condimente & Uleiuri": ["sare","piper","ulei","otet","sos","miere","mustar"]
};

// Creează taburile în HTML
const tabs = {
  general: listaGeneral,
  aldi: listaAldi,
  dm:listaDm,
  freesnapf:listaFreesnapf,
  rossmann:listaRossmann,
  kaufland: listaKaufland,
  lidl: listaLidl,
};

// Form submit
formProdus.addEventListener("submit", e => {
  e.preventDefault();
  const text = inputProdus.value.trim();
  if (text === "") return;
  addProdus("general", text); // Adaugă implicit în General
  inputProdus.value = "";
});

// Adaugă produs în DB
function addProdus(shop, text) {
  const newRef = ref(db, `products/${shop}`);
  push(newRef, { name: text });
  msgStatus.textContent = `Produs adăugat în ${shop}!`;
  msgStatus.style.opacity = 1;
  setTimeout(() => msgStatus.style.opacity = 0, 1500);
}

// Render listă
function renderList(shop) {
  const listaDiv = tabs[shop];
  listaDiv.innerHTML = "";
  const dbRef = ref(db, `products/${shop}`);
  onValue(dbRef, snapshot => {
    const data = snapshot.val();
    if (!data) return;

    // Grupare pe categorii
    const categorized = {};
    Object.values(data).forEach(item => {
      let gasit = false;
      for (const cat in categorii) {
        for (const keyword of categorii[cat]) {
          if (item.name.toLowerCase().includes(keyword)) {
            if (!categorized[cat]) categorized[cat] = [];
            categorized[cat].push({ ...item });
            gasit = true;
            break;
          }
        }
        if (gasit) break;
      }
      if (!gasit) {
        if (!categorized["Altele"]) categorized["Altele"] = [];
        categorized["Altele"].push({ ...item });
      }
    });

    // Construiește HTML
    for (const cat in categorized) {
      const divCat = document.createElement("div");
      divCat.className = "categorie-card";
      const h3 = document.createElement("h3");
      h3.textContent = cat;
      divCat.appendChild(h3);
      const ul = document.createElement("ul");
      categorized[cat].forEach(prod => {
        const li = document.createElement("li");
        li.textContent = prod.name;
        const btnDel = document.createElement("button");
        btnDel.textContent = "Șterge";
        btnDel.className = "btn-del";
        btnDel.onclick = () => removeProdus(shop, prod.name);
        li.appendChild(btnDel);
        ul.appendChild(li);
      });
      divCat.appendChild(ul);
      listaDiv.appendChild(divCat);
    }
  });
}

// Ștergere produs
function removeProdus(shop, name) {
  const dbRef = ref(db, `products/${shop}`);
  onValue(dbRef, snapshot => {
    const data = snapshot.val();
    for (const key in data) {
      if (data[key].name === name) {
        remove(ref(db, `products/${shop}/${key}`));
      }
    }
  }, { onlyOnce: true });
}

// Clear checked (nu avem checkbox momentan, doar exemplu)
clearCheckedBtn.addEventListener("click", () => {
  Object.keys(tabs).forEach(shop => {
    remove(ref(db, `products/${shop}`));
  });
});

// Initialize render
Object.keys(tabs).forEach(shop => renderList(shop));
