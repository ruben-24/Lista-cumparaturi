import { saveList, subscribeList } from './database.js';

const magazines = ["Edeka","Kaufland","DM","Rossmann","Lidl","Fressnapf","Aldi"];
let currentMagazin = magazines[0];
let shoppingLists = {};

// Inițializează listele și ascultă schimbările în Firebase
magazines.forEach(m => {
  subscribeList(m, data => {
    shoppingLists[m] = data || [];
    if(m === currentMagazin) renderList();
  });
});

// Cuvinte cheie pentru categorii
const categorii = {
  "Legume": ["rosie","rosii","castravete","morcov","ardei","salata","varza","ceapa","cartof","usturoi","spanac","broccoli","conopida"],
  "Fructe": ["mar","mere","banana","banane","portocala","portocale","lamaie","capsuni","cirese","pere","struguri"],
  "Lactate": ["lapte","iaurt","branza","unt","smantana","cascaval"],
  "Carne": ["carne tocata","pui","vita","porc","sunca","carnati","salami"],
  "Paine": ["paine","bagheta","chifle","cornuri"],
  "Bauturi": ["apa","suc","bere","vin","ceai","cafea"],
  "Condimente": ["sare","piper","ulei","otet","zahar","miere","mustar"],
  "Haine/Igiena": ["hartie","sapun","detergent","sampon","periuta","pasta de dinti","servetele"]
};

const form = document.getElementById("add-form");
const input = document.getElementById("product-input");
const listaDiv = document.getElementById("shopping-list");
const magazinTabs = document.getElementById("magazin-tabs");
const msg = document.getElementById("msg");

// Creare tab-uri magazine
magazines.forEach(m => {
  const btn = document.createElement("button");
  btn.textContent = m;
  btn.addEventListener("click", () => {
    currentMagazin = m;
    renderList();
    document.querySelectorAll("#magazin-tabs button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
  magazinTabs.appendChild(btn);
});
document.querySelector("#magazin-tabs button").classList.add("active");

// Adaugare produs
form.addEventListener("submit", e=>{
  e.preventDefault();
  if(!input.value.trim()) return;
  const produs = {nume: input.value.trim(), checked: false};
  if(!shoppingLists[currentMagazin]) shoppingLists[currentMagazin] = [];
  shoppingLists[currentMagazin].push(produs);
  input.value="";
  saveAndRender();
});

// Salvare în Firebase și rerender
function saveAndRender() {
  saveList(currentMagazin, shoppingLists[currentMagazin]);
  renderList();
  msg.style.opacity = 1;
  msg.textContent = "Lista actualizată!";
  setTimeout(()=>{msg.style.opacity=0;},1000);
}

// Renderizare lista
function renderList(){
  listaDiv.innerHTML = "";
  const produse = shoppingLists[currentMagazin] || [];

  Object.keys(categorii).forEach(cat=>{
    const produseCat = produse.filter(p=>categorii[cat].some(k=>p.nume.toLowerCase().includes(k.toLowerCase())));
    if(produseCat.length===0) return;

    const card = document.createElement("div");
    card.classList.add("categorie-card");
    const h3 = document.createElement("h3");
    h3.textContent = cat;
    card.appendChild(h3);

    const ul = document.createElement("ul");
    produseCat.forEach(p=>{
      const li = document.createElement("li");
      li.innerHTML = `<span>${p.nume}</span>`;
      const checkBox = document.createElement("input");
      checkBox.type="checkbox";
      checkBox.checked = p.checked;
      checkBox.addEventListener("change", ()=>{ p.checked = checkBox.checked; saveAndRender(); });
      const delBtn = document.createElement("button");
      delBtn.classList.add("btn-del");
      delBtn.textContent = "Șterge";
      delBtn.addEventListener("click", ()=> {
        shoppingLists[currentMagazin].splice(shoppingLists[currentMagazin].indexOf(p),1);
        saveAndRender();
      });
      li.prepend(checkBox);
      li.appendChild(delBtn);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    listaDiv.appendChild(card);
  });

  // Produse care nu se încadrează în categorii
  const produseAltele = produse.filter(p=>!Object.keys(categorii).some(cat=>categorii[cat].some(k=>p.nume.toLowerCase().includes(k.toLowerCase()))));
  if(produseAltele.length>0){
    const card = document.createElement("div");
    card.classList.add("categorie-card");
    const h3 = document.createElement("h3");
    h3.textContent = "Altele";
    card.appendChild(h3);
    const ul = document.createElement("ul");
    produseAltele.forEach(p=>{
      const li = document.createElement("li");
      li.innerHTML = `<span>${p.nume}</span>`;
      const checkBox = document.createElement("input");
      checkBox.type="checkbox";
      checkBox.checked = p.checked;
      checkBox.addEventListener("change", ()=>{ p.checked = checkBox.checked; saveAndRender(); });
      const delBtn = document.createElement("button");
      delBtn.classList.add("btn-del");
      delBtn.textContent = "Șterge";
      delBtn.addEventListener("click", ()=> {
        shoppingLists[currentMagazin].splice(shoppingLists[currentMagazin].indexOf(p),1);
        saveAndRender();
      });
      li.prepend(checkBox);
      li.appendChild(delBtn);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    listaDiv.appendChild(card);
  }
}
