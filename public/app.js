import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAhN-DQQqWLo7s2SHMEHbp67P7mPqips3k",
    authDomain: "lista--cumparaturi.firebaseapp.com",
    databaseURL: "https://lista--cumparaturi-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lista--cumparaturi",
    storageBucket: "lista--cumparaturi.firebasestorage.app",
    messagingSenderId: "1017722987139",
    appId: "1:1017722987139:web:9a00866e9b5ace247131b6",
    measurementId: "G-045KJZYQ9T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Magazine
const shops = ["Edeka", "Kaufland", "DM", "Rossmann", "Lidl", "Fressnapf", "Aldi"];
const categories = {
    "Legume": ["rosie","rosii","castravete","ardei","ceapa","morcov","varza","cartof","salata"],
    "Fructe": ["mar","mere","banana","pere","portocala","mandarina","cirese","capsuni","kiwi"],
    "Lactate": ["lapte","branza","iaurt","unt","smantana","cascaval"],
    "Carne": ["carne tocata","pui","vita","porc","sunca","carnati"],
    "Condimente": ["sare","piper","boia","oregano","cimbru","ulei","otet","mustar"],
    "Panificatie": ["paine","chifle","corn","bagheta"],
    "Bauturi": ["apa","suc","bere","vin","cafea","ceai"],
    "Curatenie": ["detergent","hartie igienica","servetele","sapun","dezinfectant"],
    "Diverse": []
};

// Taburi
const tabsContainer = document.getElementById("tabs");
const shopListsContainer = document.getElementById("shop-lists");

shops.forEach((shop, index) => {
    const btn = document.createElement("button");
    btn.textContent = shop;
    btn.classList.add("tab-button");
    if(index===0) btn.classList.add("active");
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".shop").forEach(s => s.classList.remove("active"));
        document.getElementById(shop).classList.add("active");
    });
    tabsContainer.appendChild(btn);

    const shopDiv = document.createElement("div");
    shopDiv.id = shop;
    shopDiv.classList.add("shop");
    if(index===0) shopDiv.classList.add("active");
    shopListsContainer.appendChild(shopDiv);
});

// Functie categorii
function getCategory(product) {
    product = product.toLowerCase();
    for (const [cat, keywords] of Object.entries(categories)) {
        if(keywords.some(k => product.includes(k))) return cat;
    }
    return "Diverse";
}

// Adauga produs
document.getElementById("add-button").addEventListener("click", () => {
    const input = document.getElementById("product-input");
    const name = input.value.trim();
    if(!name) return;

    const shop = document.querySelector(".shop.active").id;
    const category = getCategory(name);

    push(ref(db, shop), { name, category });
    input.value = "";
});

// Afisare produse in timp real
shops.forEach(shop => {
    const shopRef = ref(db, shop);
    onValue(shopRef, snapshot => {
        const data = snapshot.val();
        const div = document.getElementById(shop);
        div.innerHTML = "";

        if(!data) return;

        const grouped = {};
        Object.values(data).forEach(item => {
            if(!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item.name);
        });

        for(const [cat, items] of Object.entries(grouped)){
            const h3 = document.createElement("h3");
            h3.textContent = cat;
            div.appendChild(h3);

            const ul = document.createElement("ul");
            items.forEach(i => {
                const li = document.createElement("li");
                li.textContent = i;
                ul.appendChild(li);
            });
            div.appendChild(ul);
        }
    });
});
