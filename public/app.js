// Initialize Firebase
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

// Firebase setup
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Lista de magazine
const shops = ["Edeka", "Kaufland", "DM", "Rossmann", "Lidl", "Fressnapf", "Aldi"];

// Taburi
const tabsContainer = document.getElementById("tabs");
shops.forEach((shop, index) => {
    const btn = document.createElement("button");
    btn.textContent = shop;
    btn.classList.add("tab-button");
    if (index === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".shop").forEach(s => s.classList.remove("active"));
        document.getElementById(shop).classList.add("active");
    });
    tabsContainer.appendChild(btn);
});

// Categorie keywords
const categories = {
    "Legume": ["rosie", "rosii", "castravete", "ardei", "ceapa", "morcov", "varza", "cartof", "salata"],
    "Fructe": ["mar", "mere", "banana", "pere", "portocala", "mandarina", "cirese", "capsuni", "kiwi"],
    "Lactate": ["lapte", "branza", "iaurt", "unt", "smantana", "cascaval"],
    "Carne": ["carne tocata", "pui", "vita", "porc", "sunca", "carnati"],
    "Condimente": ["sare", "piper", "boia", "oregano", "cimbru", "ulei", "otet", "mustar"],
    "Panificatie": ["paine", "chifle", "corn", "bagheta"],
    "Bauturi": ["apa", "suc", "bere", "vin", "cafea", "ceai"],
    "Curatenie": ["detergent", "hartie igienica", "servetele", "sapun", "dezinfectant"],
    "Diverse": [] // Tot ce nu se incadreaza in categoriile de mai sus
};

// Functie pentru a determina categoria unui produs
function getCategory(product) {
    product = product.toLowerCase();
    for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(k => product.includes(k))) return cat;
    }
    return "Diverse";
}

// Creeaza listele pentru fiecare magazin
shops.forEach(shop => {
    const shopDiv = document.createElement("div");
    shopDiv.id = shop;
    shopDiv.classList.add("shop");
    if (shop === "Edeka") shopDiv.classList.add("active");
    document.body.appendChild(shopDiv);
});

// Adaugare produs
document.getElementById("add-button").addEventListener("click", () => {
    const input = document.getElementById("product-input");
    const productName = input.value.trim();
    if (!productName) return;

    const activeShop = document.querySelector(".shop.active").id;
    const category = getCategory(productName);

    push(ref(db, activeShop), { name: productName, category });

    input.value = "";
});

// Afisare produse in timp real
shops.forEach(shop => {
    const shopRef = ref(db, shop);
    onValue(shopRef, snapshot => {
        const data = snapshot.val();
        const shopDiv = document.getElementById(shop);
        shopDiv.innerHTML = ""; // goleste continutul

        if (!data) return;

        // Grupa pe categorii
        const grouped = {};
        Object.values(data).forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item.name);
        });

        for (const [cat, items] of Object.entries(grouped)) {
            const h3 = document.createElement("h3");
            h3.textContent = cat;
            shopDiv.appendChild(h3);

            const ul = document.createElement("ul");
            items.forEach(i => {
                const li = document.createElement("li");
                li.textContent = i;
                ul.appendChild(li);
            });
            shopDiv.appendChild(ul);
        }
    });
});
