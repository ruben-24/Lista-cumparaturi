// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔹 Config Firebase
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

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Categorii și cuvinte cheie
const categorii = {
  "Legume": ["rosie","rosii","rosi","castravete","ardei","morcov","cartof","ceapa","usturoi","salata","varza","broccoli","conopida","vinete","dovlecel","mazare","fasole","spanac"],
  "Fructe": ["mar","mere","banana","banane","portocala","portocale","mandarina","pere","piersica","piersici","struguri","pepene","cirese","visine","prune","lamaie","lamai","kiwi"],
  "Lactate": ["lapte","iaurt","smantana","unt","branza","telemea","cascaval","parmezan","lapte batut"],
  "Carne": ["pui","piept de pui","carne tocata","vita","porc","pulpe","curcan","sunca","carnati"],
  "Paine": ["paine","bagheta","chifle","covrigi","lipie"],
  "Bauturi": ["apa","cola","fanta","suc","bere","vin","whisky","vodka","ceai","cafea"],
  "Dulciuri": ["ciocolata","bomboane","napolitane","biscuiti","inghetata","prajitura","cheesecake"],
  "Condimente": ["sare","piper","ulei","otet","oregano","busuioc","cimbru","rozmarin","boia"],
  "Curatenie": ["detergent","hartie igienica","servetele","sapun","dezinfectant"],
  "Animale": ["mancare pisici","mancare caini","litiera","nisip pisici","gustari animale"],
  "Altele": []
};

// 🔹 Detectează categoria
function detecteazaCategorie(prod) {
  prod = prod.toLowerCase();
  for (let categorie in categorii) {
    if (categorii[categorie].some(cuv => prod.includes(cuv))) {
      return categorie;
    }
  }
  return "Altele";
}

// 🔹 Elemente DOM
const form = document.getElementById("formProdus");
const input = document.getElementById("inputProdus");
const msgStatus = document.getElementById("msgStatus");
const btnClear = document.getElementById("clearChecked");

// tab curent (default general)
let currentTab = "general";

// 🔹 Schimbă tab
window.switchTab = function (tab) {
  currentTab = tab;

  // vizual
  document.querySelectorAll(".shop").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.querySelector(`.tab-button[onclick="switchTab('${tab}')"]`).classList.add("active");

  renderList(tab);
};

// 🔹 Adaugă produs
form.addEventListener("submit", e => {
  e.preventDefault();
  const produs = input.value.trim();
  if (!produs) return;

  const categorie = detecteazaCategorie(produs);
  const refCat = ref(db, `produse/${currentTab}/${categorie}`);

  push(refCat, {
    nume: produs,
    bifat: false
  });

  input.value = "";
  showStatus("Produs adăugat!");
});

// 🔹 Afișează lista
function renderList(tab) {
  const container = (tab === "general") ? document.getElementById("lista") : document.getElementById("lista-lidl");

  onValue(ref(db, "produse/" + tab), snapshot => {
    container.innerHTML = "";

    if (!snapshot.exists()) {
      container.innerHTML = "<p style='text-align:center;color:#999;'>Nicio cumpărătură adăugată.</p>";
      return;
    }

    const data = snapshot.val();

    Object.keys(data).forEach(categorie => {
      const card = document.createElement("div");
      card.className = "categorie-card";

      const h3 = document.createElement("h3");
      h3.textContent = categorie;
      card.appendChild(h3);

      const ul = document.createElement("ul");

      Object.entries(data[categorie]).forEach(([id, produs]) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = produs.nume;
        if (produs.bifat) span.style.textDecoration = "line-through";
        li.appendChild(span);

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editează";
        btnEdit.className = "btn-edit";
        btnEdit.onclick = () => {
          const nou = prompt("Editează produsul:", produs.nume);
          if (nou) {
            update(ref(db, `produse/${tab}/${categorie}/${id}`), { nume: nou });
          }
        };

        const btnDel = document.createElement("button");
        btnDel.textContent = "Șterge";
        btnDel.className = "btn-del";
        btnDel.onclick = () => remove(ref(db, `produse/${tab}/${categorie}/${id}`));

        li.appendChild(btnEdit);
        li.appendChild(btnDel);

        li.onclick = e => {
          if (e.target === btnEdit || e.target === btnDel) return;
          update(ref(db, `produse/${tab}/${categorie}/${id}`), { bifat: !produs.bifat });
        };

        ul.appendChild(li);
      });

      card.appendChild(ul);
      container.appendChild(card);
    });
  });
}

// 🔹 Șterge toate bifatele din tabul curent
btnClear.addEventListener("click", () => {
  onValue(ref(db, "produse/" + currentTab), snapshot => {
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    for (let categorie in data) {
      for (let id in data[categorie]) {
        if (data[categorie][id].bifat) {
          remove(ref(db, `produse/${currentTab}/${categorie}/${id}`));
        }
      }
    }
  }, { onlyOnce: true });
  showStatus("Produse bifate șterse!");
});

// 🔹 Status vizual
function showStatus(msg) {
  msgStatus.textContent = msg;
  msgStatus.style.opacity = 1;
  setTimeout(() => msgStatus.style.opacity = 0, 2000);
}

// 🔹 Pornim cu tab-ul "general"
renderList("general");
