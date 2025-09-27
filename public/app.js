// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Înlocuiește cu datele tale din Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAhN-DQQqWLo7s2SHMEHbp67P7mPqips3k",
  authDomain: "lista--cumparaturi.firebaseapp.com",
  databaseURL: "https://lista--cumparaturi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lista--cumparaturi",
  storageBucket: "lista--cumparaturi.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listaRef = ref(db, "lista");

// 🔹 categorii + cuvinte cheie
const categorii = {
  "Fructe": ["mar","mere","banana","banane","portocala","portocale","kiwi","struguri","cirese","piersici","lamai","capsuni","ananas"],
  "Legume": ["rosie","rosii","rosi","cartof","cartofi","ceapa","usturoi","ardei","morcov","morcovi","castravete","castraveti","varza","salata","dovlecel","broccoli","conopida","spanac","vinete"],
  "Lactate": ["lapte","iaurt","branza","cascaval","smantana","unt","telemea","mozzarella","ricotta","mascarpone"],
  "Carne": ["carne tocata","carne","pui","piept de pui","pulpe de pui","vita","vita tocata","porc","porc tocata","sunca","bacon","salam","carnati","pastrama","somon","ton","peste","creveti"],
  "Ouă": ["ou","oua","ouă"],
  "Condimente": ["sare","piper","oregano","busuioc","cimbru","paprika","boia","curry","scortisoara","coriandru","chili","ghimbir"],
  "Băuturi": ["apa","suc","bere","vin","cafea","ceai","cola","fanta","whiskey","rom"],
  "Pâine": ["paine","pâine","bagheta","chifla","corn","covrigi","patiserie"],
  "Dulciuri": ["ciocolata","biscuiti","bomboane","chips","napolitane","sticks"],
  "Altele": []
};

// funcție detectare categorie
function detecteazaCategorie(nume) {
  const lower = nume.toLowerCase();
  for (const [cat, words] of Object.entries(categorii)) {
    if (words.some(w => lower.includes(w))) return cat;
  }
  return "Altele";
}

// refs UI
const form = document.getElementById("formProdus");
const input = document.getElementById("inputProdus");
const listaDiv = document.getElementById("lista");
const msg = document.getElementById("msgStatus");
const clearBtn = document.getElementById("clearChecked");

function showMsg(text, timeout=1500) {
  msg.textContent = text;
  msg.style.opacity = "1";
  setTimeout(()=> msg.style.opacity="0", timeout);
}

// Adaugă produs
form.addEventListener("submit", e => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  const cat = detecteazaCategorie(val);
  const itemRef = push(listaRef);
  set(itemRef, {
    id: itemRef.key,
    nume: val,
    categorie: cat,
    checked: false,
    createdAt: Date.now()
  });
  input.value = "";
  showMsg(`Adăugat la ${cat}`);
});

// Afișează lista live
onValue(listaRef, snapshot => {
  const data = snapshot.val() || {};
  const items = Object.values(data);
  listaDiv.innerHTML = "";

  // grupare pe categorii
  const grupat = {};
  items.forEach(it => {
    if (!grupat[it.categorie]) grupat[it.categorie] = [];
    grupat[it.categorie].push(it);
  });

  const ordine = Object.keys(categorii).concat(["Altele"]);
  ordine.forEach(cat => {
    if (!grupat[cat]) return;
    const card = document.createElement("div");
    card.className = "categorie-card";

    const h3 = document.createElement("h3");
    h3.textContent = `${cat} (${grupat[cat].length})`;
    card.appendChild(h3);

    const ul = document.createElement("ul");
    grupat[cat].forEach(item => {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";
      left.style.gap = "10px";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = item.checked;
      cb.addEventListener("change", () => {
        update(ref(db, `lista/${item.id}`), { checked: cb.checked });
      });

      const span = document.createElement("span");
      span.textContent = item.nume;
      if (item.checked) span.style.textDecoration = "line-through";

      left.appendChild(cb);
      left.appendChild(span);

      const actions = document.createElement("div");
      const edit = document.createElement("button");
      edit.textContent = "Editează";
      edit.className = "btn-edit";
      edit.addEventListener("click", () => {
        const nou = prompt("Editează produsul:", item.nume);
        if (nou) {
          update(ref(db, `lista/${item.id}`), {
            nume: nou,
            categorie: detecteazaCategorie(nou)
          });
        }
      });

      const del = document.createElement("button");
      del.textContent = "Șterge";
      del.className = "btn-del";
      del.addEventListener("click", () => {
        remove(ref(db, `lista/${item.id}`));
      });

      actions.appendChild(edit);
      actions.appendChild(del);

      li.appendChild(left);
      li.appendChild(actions);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    listaDiv.appendChild(card);
  });
});

// Șterge bifate
clearBtn.addEventListener("click", () => {
  onValue(listaRef, snapshot => {
    const data = snapshot.val() || {};
    Object.values(data).forEach(item => {
      if (item.checked) remove(ref(db, `lista/${item.id}`));
    });
  }, { onlyOnce: true });
});
