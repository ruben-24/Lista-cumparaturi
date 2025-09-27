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
const inputCantitate = document.getElementById("inputCantitate");
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

// Categorii și cuvinte cheie
const categorii = {
  "Legume & Fructe": [
    // Fructe
    "mere", "pere", "banane", "portocale", "mandarine", "lamâie", "lamaie", "grepefruit", "grapefruit", "clementine", "avocado",
    "struguri", "struguri albi", "struguri negri", "rodie", "rodii", "kiwi", "ananas", "mango", "papaya", "passion fruit", "maracuja",
    "capsuni", "căpșuni", "capsuna", "erdbeeren", "zmeura", "zmeură", "himbeeren", "afine", "heidelbeeren", "căpșune", "visine", "visin", "cirese", "cires", "prune", "pflaumen",
    "pepene", "pepene verde", "pepeni", "pepene galben", "pepene rosu", "harbuz", "pepene rosii", "melon", "cantaloupe", "wassermelone",
    "caise", "caisa", "aprikosen", "piersici", "piersica", "pfirsich", "nectarine", "nectarina", "dates", "curmale",

    // Legume
    "rosii", "rosie", "ros", "roșii", "tomato", "tomaten", "cherry tomatoes", "castraveti", "castravete", "cucumber", "gurken", "varza", "varză", "cabbage", "kohl", "conopida", "conopidă", "cauliflower", "blumenkohl", "brocoli", "broccoli", "brokkoli",
    "morcovi", "morcov", "carrot", "karotten", "möhren", "ceapa", "ceapă", "onion", "zwiebeln", "ceapa rosie", "red onion", "cartofi", "cartof", "potato", "kartoffeln", "potatoes", "cartofi albi", "cartofi rosii", "ardei", "ardei gras", "bell pepper", "paprika", "ardei iute", "chili", "ardei capia",
    "salata", "salată", "lettuce", "salat", "salata verde", "salata iceberg", "iceberg lettuce", "salata romana", "romaine lettuce", "spanac", "spinach", "spinat", "praz", "leek", "lauch", "usturoi", "garlic", "knoblauch", "telina", "țelină", "celery", "sellerie", "celery",
    "dovleac", "kürbis", "dovlecel", "zucchini", "zucchini", "dovlecei", "patlagea", "patlagele", "patlagin", "aubergine", "vinete", "vânată", "vanata", "pasta", "pastarnac", "păstârnac", "pastinake",
    "fasole verde", "fasole", "bohnen", "mazare", "erbsen", "porumb", "mais", "porumb dulce", "pătlăgel", "pătlăgei", "radieschen", "ridichi", "ridiche", "repat", "rădăucean", "hrean", "meerrettich", "răsad", "legume congelate", "tiefkühlgemüse", "legume la conserva", "legume la borcan"
  ],

  "Lactate & Ouă": [
    "lapte", "lapte batut", "lapte de consum", "milch", "lapte praf", "lapte condensat", "lapte vegetal", "lapte de soia", "lapte de migdale", "lapte de cocos", "mandelmilch",
    "iaurt", "iaurturi", "iaurt grecesc", "griechischer joghurt", "iaurt natural", "iaurt cu fructe", "iaurt de oaie", "iaurt de capra", "iaurt bio", "joghurt",
    "branza", "brânză", "branza", "käse", "branza de vaci", "quark", "branza topita", "brânză topită", "schmelzkäse", "branza proaspata", "frischkäse", "branza proaspătă", "branza burduf", "brânză în coajă", "branza capra", "ziegenkäse", "branza oaie", "cascaval", "cașcaval", "cascaval", "telemea", "telemea", "urda", "urdă", "feta", "mozzarella", "parmezan", "gouda", "edam", "cheddar", "ricotta", "mascarpone",
    "smantana", "smântână", "smantana", "sahne", "smantana pentru gatit", "smantana dulce", "smantana lichida", "frisca", "frișcă", "schlagsahne",
    "unt", "butter", "untura", "unt de arahide", "erdnussbutter", "unt vegetal",
    "rama", "rămă", "rama", "margarina", "margarină", "margarine",
    "oua", "ou", "ouă", "eier", "oua codri", "ouă de gaina", "ouă de prepeliță", "ouă bio", "albus", "gălbenuș", "eiweiß", "eigelb"
  ],

  "Carne, Păsări & Pește": [
    // Carne
    "carne", "carne de vita", "carne de porc", "carne de oaie", "carne de miel", "carne tocată", "carne macră", "fleisch", "hackfleisch",
    "vita", "vită", "vita", "rindfleisch", "friptura de vita", "muschi de vita", "pulpa de vita", "carne de vita",
    "porc", "schweinefleisch", "ceafa de porc", "muschi de porc", "pulpa de porc", "costita", "coastă", "kotelett", "carne de porc",
    "pui", "huhn", "hähnchen", "piept de pui", "pulpe de pui", "aripi de pui", "ficat de pui", "pui intreg", "carne de pui",
    "curcan", "puten", "carne de curcan", "piept de curcan",
    "bacon", "speck", "slanina", "șuncă", "sunca", "schinken", "sunca praga", "sunca de pui", "sunca de porc", "cârnați", "carnati", "carnati", "wurst", "salame", "salam", "parizer", "șorici", "sorici", "crenvurști", "crenvurst", "leberkäse", "leberkas",

    // Pește & Fructe de Mare
    "peste", "pește", "peste", "fisch", "somon", "lachs", "somon afumat", "ton", "thunfisch", "ton in conserva", "ton la conserva", "sardine", "sardinen", "sardine la conserva", "macrou", "makrele", "macrou", "scrumbi", "scrumbii", "pastrav", "păstrăv", "forelle", "calcan", "sola", "crap", "salgau", "salau", "hamsie", "hamsie", "file de peste", "peste congelat", "tiefkühlfisch",
    "fructe de mare", "meeresfrüchte", "creveti", "creveți", "creveti", "garnelen", "shrimps", "calamari", "calamar", "sepii", "midii", "muscheln", "mușchi", "stridii", "scampi", "homar", "hummer", "rac", "raci", "krebse"
  ],

  "Panificație & Produse de Patiserie": [
    "paine", "pâine", "paine", "brot", "paine alba", "paine neagra", "paine integrala", "vollkornbrot", "paine cu seminte", "paine feliata", "paine nesfeliata", "paine cu masline", "paine bagheta", "bagheta", "baghetă", "bagheta", "baguette", "bagheta franțuzească",
    "chifla", "chiflă", "chifla", "chifle", "brötchen", "covrigi", "covrig", "covrigi", "brezel", "covrigi cu susan", "covrigi inmuiati", "covrigele",
    "corn", "cornuri", "corn cu ciocolata", "corn cu gem", "corn cu scarlata", "croasant", "croissant", "hörnchen",
    "pateu", "paté", "pateu", "leberwurst", "plăcintă", "placinta", "placinta cu branza", "placinta cu visine", "saratele", "săratele", "biscuiti sarati", "biscuiți sărați", "bureki", "burechi",
    "pizza", "pizza congelata", "aluat", "teig", "aluat de pizza", "aluat foietaj", "blätterteig", "aluat pentru placinta"
  ],

  "Băuturi": [
    "apa", "apă", "apa", "wasser", "apa plata", "stilles wasser", "apa minerala", "mineralwasser", "apa carbogazoasa", "sprudel", "suc", "saft", "sucuri", "suc de mere", "suc de portocale", "suc de piersici", "nectar", "suc la borcan", "suc natural",
    "bere", "beri", "bier", "bere blonda", "bere bruna", "bere la halba", "bere fara alcool", "alkoholfreies bier", "sticla de bere", "doza de bere",
    "vin", "wein", "vin rosu", "rotwein", "vin alb", "weißwein", "vin rose", "roséwein", "vin spumant", "sekt", "vin de masa", "sec", "trocken", "demisec", "halbtrocken", "dulce", "sticla de vin", "pahar de vin",
    "ceai", "tee", "ceaiuri", "ceai negru", "schwarzer tee", "ceai verde", "grüner tee", "ceai de fructe", "früchtetee", "ceai herbal", "kräutertee", "ceai la plic", "ceai vrac",
    "cafea", "kaffee", "cafea boabe", "cafea macinata", "cafea solubila", "nescafe", "nes", "capsule cafea", "cafea la pachet", "cafea filtru", "filterkaffee",
    "energizant", "energizante", "energy drink", "red bull", "redbull", "burn", "monster", "bautura isotonica", "isotonisches getränk", "băuturi isotonice",
    "bautura racori", "erfrischungsgetränk", "bautura rece", "limonada", "limonadă", "limo", "sirop", "siropuri", "sirup"
  ],

  "Condimente, Uleiuri & Sosuri": [
    "sare", "salz", "sare fina", "sare mare", "sare iodata", "sare cu ierburi", "piper", "pfeffer", "piper negru", "piper alb", "piper iute", "chimen", "chimion", "kümmel", "cumin",
    "ulei", "öl", "ulei de masline", "olivenöl", "ulei de floarea soarelui", "sonnenblumenöl", "ulei de palmier", "ulei de cocos", "kokosöl", "ulei pentru prajit", "ulei vegetal",
    "otet", "oțet", "otet", "essig", "otet balsamic", "balsamico", "otet de vin", "weinessig", "otet de mere", "apfelessig",
    "sos", "sosuri", "soße", "sos de rosii", "tomatenmark", "sos de soia", "sojasoße", "sos picant", "scharfe soße", "sos barbecue", "sos usturoi", "sos chili", "ketchup", "maioneza", "mayonnaise", "mayo", "mustar", "senf", "mustar cu miere", "mustar iute",
    "miere", "honig", "miere de albine", "miere de mana", "miere de tei", "miere de poliflora", "miere la borcan",
    "drojdie", "hefe", "drojdie praf", "drojdie proaspata", "bicarbonat", "backpulver", "bicarbonat de sodiu", "praf de copt", "esenta de vanilie", "vanilleextrakt", "extract de vanilie", "zahar vanilin", "vanillezucker", "zeama de lamaie", "suc de lamaie", "zitronensaft"
  ],

  "Detergenți & Îngrijire Casă": [
    "detergent", "detergent rufe", "waschmittel", "detergent rufe colorate", "detergent rufe albe", "detergent rufe delicat", "detergent rufe lichid", "flüssigwaschmittel", "detergent rufe praf", "capsule detergent", "waschkapseln",
    "balsam rufe", "balsam de rufe", "balsam rufe", "weichspüler", "balsam pentru rufe",
    "detergent vase", "geschirrspülmittel", "detergent vase lichid", "detergent vase praf", "detergent vase tablete", "spülmaschinentabs", "sapun vase", "săpun vase", "sapun de vase",
    "detergent wc", "detergent toaleta", "wc reiniger", "detergent pentru wc", "gel wc", "bile wc", "bile de toaleta", "wc steine",
    "detergent parchet", "detergent pentru parchet", "detergent podea", "detergent lemn", "detergent pentru geamuri", "fensterreiniger", "detergent sticla", "detergent bucatarie", "detergent baie", "badreiniger",
    "clor", "chlor", "clor tip", "clor tablet", "sapun de rufe", "săpun de rufe", "sapun universal", "săpun universal", "allzweckreiniger",
    "mirosici vase", "mirositor vase", "aromă vase", "mirositor pentru vase", "spülmaschinenduft", "aromator rufe", "mirositor rufe", "prosoape umede", "feuchttücher", "servetele umede"
  ],

  "Produse Congelate": [
    "pizza congelata", "pizza congelată", "tiefkühlpizza", "pizza la congelator", "pizza congelata", "cartofi congelati", "tiefkühlkartoffeln", "cartofi prajiti congelati", "pommes frites", "cartofi pai congelati", "legume congelate", "tiefkühlgemüse", "mix legume congelate", "fructe congelate", "tiefkühlobst", "capsuni congelate", "zmeura congelata", "spanac congelat", "tiefkühlspinat",
    "peste congelat", "file peste congelat", "creveti congelati", "fructe de mare congelate", "pui congelat", "aripioare pui congelate", "carne congelata", "mic dejun congelat", "crocante congelate", "gogosi congelate", "inghetata", "înghețată", "inghetata", "eis", "speiseeis", "inghetata la cornet", "inghetata la punga", "eiscreme"
  ],

  "Bunătăți & Dulciuri": [
    "inghetata", "inghetata la cornet", "inghetata la punga", "inghetata la vas", "inghetata napoca", "inghetata cu vanilie", "inghetata cu ciocolata", "eis",
    "biscuiti", "biscuiți", "biscuiti", "kekse", "biscuiti cu ciocolata", "biscuiti digestie", "biscuiti petrecere", "pesmet", "pesmeți", "prajituri", "prăjituri", "prajitura", "tort", "torte", "tort aniversar", "ecler", "amandina", "savarina", "chec", "kuchen", "cozonac", "cozonac cu nuca", "cozonac cu mac", "coliva",
    "ciocolata", "schokolade", "ciocolata alba", "weiße schokolade", "ciocolata neagra", "dunkle schokolade", "ciocolata cu lapte", "milchschokolade", "ciocolata cu alune", "bomboane", "bonbons", "bomboane cu ciocolata", "bomboane acrisor", "dropsuri", "jeleu", "gummi", "guma de mestecat", "kaugummi", "gume", "marshmallow", "dragiste",
    "waffle", "waffeln", "vafla", "vafla", "clatite", "clătite", "pfannkuchen", "clatite congelate", "dulceata", "dulceață", "dulceata", "marmelade", "dulceata de capsuni", "dulceata de visine", "gem", "konfitüre", "gem de caise", "gem de prune", "miere", "sirop de artar", "zahar", "zahăr", "zahar", "zucker", "zahar brun", "brauner zucker", "zahar vanilin", "faina", "făină", "faina", "mehl", "faina alba", "faina integrala", "vollkornmehl", "ovaz", "haferflocken", "orez", "reis", "orez basmati", "paste", "nudeln", "paste fainoase", "spaghete", "spaghetti", "macaroane", "makkaroni"
  ],

  "Produse pentru Animale": [
    // Hrană pentru câini
    "hrana caine", "hrană pentru câini", "dog food", "hunde futter", "hrana caine puppy", "hrană pentru cățeluși", "bobite caine", "granule câini", "dog kibble", "hrana caine adult", "hrana caine senior", "hrana umeda caine", "hrană umedă pentru câini", "dog wet food", "hrana caine boabe", "conserva caine", "conservă pentru câini", "os de ros", "os de roșii", "os de jucarie", "os din piele", "dog treats", "gustari caine", "răsplată pentru câini", "hrana veterinara caine", "diet food for dogs",

    // Hrană pentru pisici
    "hrana pisica", "hrană pentru pisici", "cat food", "katzen futter", "hrana pisica kitten", "hrană pentru pisoi", "bobite pisica", "granule pisici", "cat kibble", "hrana pisica adult", "hrana pisica senior", "hrana umeda pisica", "hrană umedă pentru pisici", "cat wet food", "hrana pisica boabe", "conserva pisica", "conservă pentru pisici", "mancare pisica pateu", "mâncare pisică pateu", "mancare pisica bucati", "snack pisici", "cat treats", "gustari pisica", "iarba pentru pisici", "cat grass", "catnip",

    // Nisip și accesorii pentru pisici
    "nisip pisici", "nisip pentru pisici", "cat litter", "katzenstreu", "nisip pisici aglomerant", "nisip aglomerant", "nisip pisici silica", "nisip silica", "nisip pisici perfumat", "nisip cu miros", "nisip pisici biodegradabil", "lopatica nisip pisici", "littermate", "litter box", "lasa pisici", "lăsă pentru pisici", "toaleta pisica", "wc pisici",

    // Jucării și îngrijire
    "jucarii caine", "jucării pentru câini", "dog toys", "jucarii pisici", "jucării pentru pisici", "cat toys", "perie caine", "perie pentru câini", "perie pisica", "perie pentru pisici", "shampon caine", "șampon pentru câini", "dog shampoo", "shampon pisica", "șampon pentru pisici", "cat shampoo", "antiparazit caine", "antiparazit pentru câini", "antiparazit pisica", "antiparazit pentru pisici", "zgarda caine", "zgardă pentru câini", "dog collar", "lesa caine", "lesă pentru câini", "dog leash"
  ]
};

// Form submit
formProdus.addEventListener("submit", e => {
  e.preventDefault();
  const shop = magazinSelect.value;
  const nume = inputProdus.value.trim();
  const cantitate = inputCantitate.value.trim();
  if (!nume) return;

  addProdus(shop, nume, cantitate);
  inputProdus.value = "";
  inputCantitate.value = "";
});

// Adaugă produs
function addProdus(shop, nume, cantitate) {
  const newRef = ref(db, `products/${shop}`);
  push(newRef, { name: nume, cantitate });
  msgStatus.textContent = `Produs adăugat la ${shop}`;
  msgStatus.style.opacity = 1;
  setTimeout(() => msgStatus.style.opacity = 0, 2000);
}

// Render listă
function renderList(shop) {
  const listaDiv = tabs[shop];
  const shopRef = ref(db, `products/${shop}`);

  onValue(shopRef, snapshot => {
    const data = snapshot.val() || {};
    const items = Object.entries(data).map(([id, val]) => ({ id, ...val }));

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
        // MODIFICARE: Afișează produsul chiar dacă cantitatea este goală
        li.textContent = item.cantitate && item.cantitate.trim() !== ""
          ? `${item.name} — ${item.cantitate}`
          : item.name;

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

// Șterge toate
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
