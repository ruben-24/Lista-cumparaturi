import { saveList, subscribeList } from "./database.js";

// Magazin curent selectat
let currentMagazin = "Edeka";

// Cuvinte cheie pentru categorii
const categoriesKeywords = {
  "Legume": ["rosie","rosii","castravete","ardei","salata","ceapa","morcov","varza","broccoli","conopida","cartof"],
  "Fructe": ["mar","mere","banana","banane","portocala","portocale","cirese","capsuni","piersica","pruna","lamâie"],
  "Carne": ["carne","carne tocata","pui","vita","porc","curcan","slanina","sunca"],
  "Lactate": ["lapte","iaurt","branza","smantana","unt","cascaval","oua"],
  "Condimente": ["sare","piper","oregano","boia","scortisoara","cimbru","busuioc","ghimbir"],
  "Bauturi": ["apa","suc","bere","vin","cafea","ceai","limonada","lapte"],
  "Produse de curățenie": ["detergent","hartie","servetele","sapun","dezinfectant","solutie","burete"],
  "Altele": []
};

// Elemente DOM
const productInput = document.getElementById("productInput");
const addBtn = document.getElementById("addBtn");
const tabs = document.querySelectorAll(".tab-button");
const listsContainer = document.getElementById("listsContainer");

// Liste în memorie
let lists = {};

// Detectare tab selectat
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentMagazin = tab.dataset.magazin;
    renderLists();
  });
});

// Adaugare produs
addBtn.addEventListener("click", () => {
  const product = productInput.value.trim();
  if (!product) return;

  if (!lists[currentMagazin]) lists[currentMagazin] = [];
  lists[currentMagazin].push(product);

  saveList(currentMagazin, lists[currentMagazin]);
  productInput.value = "";
});

// Sorteaza produsul pe categorie
function getCategory(product) {
  const lower = product.toLowerCase();
  for (let [cat, keywords] of Object.entries(categoriesKeywords)) {
    for (let key of keywords) {
      if (lower.includes(key)) return cat;
    }
  }
  return "Altele";
}

// Randare liste
function renderLists() {
  if (!lists[currentMagazin]) lists[currentMagazin] = [];

  Object.keys(categoriesKeywords).forEach(cat => {
    const ul = document.getElementById(cat.replace(/ /g,""));
    if (ul) ul.innerHTML = "";
  });

  lists[currentMagazin].forEach(prod => {
    const cat = getCategory(prod);
    const ul = document.getElementById(cat.replace(/ /g,""));
    if (ul) {
      const li = document.createElement("li");
      li.textContent = prod;
      li.classList.add("product-item");
      ul.appendChild(li);
    }
  });
}

// Ascultare Firebase in timp real
tabs.forEach(tab => {
  subscribeList(tab.dataset.magazin, (data) => {
    lists[tab.dataset.magazin] = data || [];
    if (tab.dataset.magazin === currentMagazin) renderLists();
  });
});

// Initial render
renderLists();
