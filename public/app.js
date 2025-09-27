import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔹 Configurare Firebase (înlocuiește cu datele tale)
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
const database = getDatabase(app);

// 🔹 Variabila curentă pentru magazinul selectat
let currentShop = "Edeka";

// 🔹 Categorii și cuvinte cheie
const categories = {
  "Legume": ["rosie", "rosii", "rosi", "castravete", "ardei", "morcov", "cartof", "ceapa", "usturoi", "salata", "varza", "broccoli", "conopida", "vinete", "dovlecel", "mazare", "fasole verde", "spanac"],
  "Fructe": ["mar", "mere", "banana", "banane", "portocala", "portocale", "mandarina", "pere", "piersica", "piersici", "struguri", "pepene", "cirese", "visine", "prune", "lamaie", "lamai", "kiwi"],
  "Lactate": ["lapte", "iaurt", "smantana", "unt", "branza", "telemea", "cascaval", "parmezan", "lapte batut"],
  "Carne": ["pui", "piept de pui", "carne tocata", "vita", "porc", "pulpe", "curcan", "sunca", "carnati"],
  "Paine": ["paine", "bagheta", "chifle", "covrigi", "lipie"],
  "Bauturi": ["apa", "cola", "fanta", "suc", "bere", "vin", "whisky", "vodka", "ceai", "cafea"],
  "Dulciuri": ["ciocolata", "bomboane", "napolitane", "biscuiti", "inghetata", "prăjitură", "cheesecake"],
  "Condimente": ["sare", "piper", "ulei", "otet", "oregano", "busuioc", "cimbru", "rozmarin", "boia"],
  "Curatenie": ["detergent", "hartie igienica", "servetele", "sapun", "dezinfectant"],
  "Animale": ["mancare pisici", "mancare caini", "litiera", "nisip pisici", "gustari animale"]
};

// 🔹 Funcție pentru sortare automată pe categorii
function getCategory(product) {
  for (let category in categories) {
    if (categories[category].some(word => product.includes(word))) {
      return category;
    }
  }
  return "Altele";
}

// 🔹 Schimbă magazinul
window.switchShop = function (shopName) {
  currentShop = shopName;
  document.querySelectorAll(".shop").forEach(s => s.classList.remove("active"));
  document.getElementById(shopName).classList.add("active");
  renderList();
};

// 🔹 Adaugă produs
window.addProduct = function () {
  const input = document.getElementById("product-input");
  let product = input.value.trim().toLowerCase();
  if (!product) return;

  let category = getCategory(product);
  const productRef = ref(database, `${currentShop}/${category}`);
  push(productRef, product);

  input.value = "";
};

// 🔹 Afișează lista pentru magazinul curent
function renderList() {
  const shopContainer = document.querySelector(`#${currentShop} .categories`);
  shopContainer.innerHTML = "";

  onValue(ref(database, currentShop), (snapshot) => {
    shopContainer.innerHTML = "";
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (let category in data) {
        const categoryEl = document.createElement("div");
        categoryEl.innerHTML = `<h3>${category}</h3>`;
        const ul = document.createElement("ul");

        for (let id in data[category]) {
          const li = document.createElement("li");
          li.textContent = data[category][id];
          li.onclick = () => remove(ref(database, `${currentShop}/${category}/${id}`));
          ul.appendChild(li);
        }

        categoryEl.appendChild(ul);
        shopContainer.appendChild(categoryEl);
      }
    }
  });
}

// 🔹 La încărcarea paginii → afișăm primul magazin
renderList();
