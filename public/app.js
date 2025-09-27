import { saveList, subscribeList } from './database.js';

const magazinTabs = document.getElementById('magazin-tabs');
const shoppingListDiv = document.getElementById('shopping-list');
const form = document.getElementById('add-form');
const input = document.getElementById('product-input');

const magazine = ["Edeka","Kaufland","DM","Rossmann","Lidl","Fressnapf","Aldi"];
let currentMagazin = magazine[0];
let shoppingLists = {};

// Categorii și cuvinte cheie
const categorii = {
  "Legume": ["rosie","castravete","morcov","ceapa","ardei","varza","salata","usturoi","broccoli","cartof"],
  "Fructe": ["mar","banana","portocala","para","capsuna","strugure","cirese","kiwi"],
  "Lactate": ["lapte","iaurt","branza","unt","smantana"],
  "Carne": ["carne","carne tocata","pui","vita","porc","sunca","carnati"],
  "Paine & Cereale": ["paine","corn","croissant","cereale","faina"],
  "Bauturi": ["apa","suc","bere","vin","cafea","ceai"],
  "Condimente & Sosuri": ["sare","piper","ulei","otet","ketchup","mustar","sos"],
  "Produse curatenie": ["detergent","sapun","hartie","servetele","dezinfectant"],
  "Altele": []
};

// Creare taburi magazin
magazine.forEach(m => {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = m;
  if(m === currentMagazin) tab.classList.add('active');
  tab.addEventListener('click', () => {
    currentMagazin = m;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderList();
    subscribeToFirebase();
  });
  magazinTabs.appendChild(tab);
});

// Detectare categorie automat
function detectCategory(produs) {
  const text = produs.toLowerCase();
  for(const cat in categorii) {
    for(const key of categorii[cat]) {
      if(text.includes(key)) return cat;
    }
  }
  return "Altele";
}

function renderList() {
  shoppingListDiv.innerHTML = '';
  if(!shoppingLists[currentMagazin]) shoppingLists[currentMagazin] = [];
  shoppingLists[currentMagazin].forEach((prod, index) => {
    const div = document.createElement('div');
    div.className = 'product-item';
    const cat = detectCategory(prod.nume);
    div.innerHTML = `
      <label>
        <input type="checkbox" ${prod.checked ? 'checked' : ''} data-index="${index}">
        ${prod.nume} <span class="category-label">[${cat}]</span>
      </label>
      <button data-index="${index}">🗑️</button>
    `;
    shoppingListDiv.appendChild(div);
  });
}

function subscribeToFirebase() {
  subscribeList(currentMagazin, (data) => {
    shoppingLists[currentMagazin] = data;
    renderList();
  });
}

// Initializare subscribe
subscribeToFirebase();

// Adaugare produs
form.addEventListener('submit', e => {
  e.preventDefault();
  if(!input.value.trim()) return;
  const produs = { nume: input.value.trim(), checked: false };
  if(!shoppingLists[currentMagazin]) shoppingLists[currentMagazin] = [];
  shoppingLists[currentMagazin].push(produs);
  input.value = '';
  saveAndRender();
});

// Toggle checkbox si stergere
shoppingListDiv.addEventListener('click', e => {
  const index = e.target.dataset.index;
  if(index === undefined) return;
  if(e.target.tagName === 'BUTTON') {
    shoppingLists[currentMagazin].splice(index,1);
  } else if(e.target.type === 'checkbox') {
    shoppingLists[currentMagazin][index].checked = e.target.checked;
  }
  saveAndRender();
});

function saveAndRender() {
  saveList(currentMagazin, shoppingLists[currentMagazin]);
  renderList();
}
