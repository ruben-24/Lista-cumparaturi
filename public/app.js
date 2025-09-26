// app.js

// Cuvinte cheie pentru categorii
const categoryMap = {
  // Fructe
  'măr': 'Fructe', 'mere': 'Fructe', 'mar': 'Fructe', 'mr': 'Fructe',
  'banană': 'Fructe', 'banane': 'Fructe', 'bana': 'Fructe', 'bnn': 'Fructe',
  'portocală': 'Fructe', 'portocale': 'Fructe', 'portocala': 'Fructe', 'portoc': 'Fructe',
  'kiwi': 'Fructe', 'kw': 'Fructe',
  'strugure': 'Fructe', 'struguri': 'Fructe', 'strug': 'Fructe',
  'cireș': 'Fructe', 'cirese': 'Fructe', 'cires': 'Fructe',
  'piersică': 'Fructe', 'piersici': 'Fructe', 'piers': 'Fructe',
  'lămâie': 'Fructe', 'lamâie': 'Fructe', 'lamâi': 'Fructe', 'lami': 'Fructe',
  'mandarină': 'Fructe', 'mandarine': 'Fructe', 'mandar': 'Fructe',
  'pepene': 'Fructe', 'ananas': 'Fructe', 'căpșună': 'Fructe', 'capsuna': 'Fructe',

  // Legume
  'roșie': 'Legume', 'rosie': 'Legume', 'rosi': 'Legume', 'rosii': 'Legume', 'ros': 'Legume',
  'cartof': 'Legume', 'cartofi': 'Legume', 'cart': 'Legume',
  'ceapă': 'Legume', 'ceapa': 'Legume', 'cepe': 'Legume', 'cp': 'Legume',
  'usturoi': 'Legume', 'ust': 'Legume',
  'ardei': 'Legume', 'ardei gras': 'Legume', 'argr': 'Legume',
  'morcov': 'Legume', 'morcovi': 'Legume', 'mrc': 'Legume',
  'castravete': 'Legume', 'castraveti': 'Legume', 'castr': 'Legume',
  'varză': 'Legume', 'varza': 'Legume', 'vrz': 'Legume',
  'salată': 'Legume', 'salata': 'Legume', 'slt': 'Legume',
  'dovlecel': 'Legume', 'dovlecei': 'Legume', 'dvlc': 'Legume',
  'broccoli': 'Legume', 'broc': 'Legume',
  'conopidă': 'Legume', 'conopida': 'Legume', 'conop': 'Legume',
  'spanac': 'Legume', 'spn': 'Legume',
  'cartof dulce': 'Legume', 'cartofi dulci': 'Legume', 'ctd': 'Legume',
  'vinete': 'Legume', 'vânătă': 'Legume', 'vanata': 'Legume',

  // Carne și mezeluri
  'carne tocată': 'Carne', 'carne tocata': 'Carne', 'tocata': 'Carne',
  'carne de pui': 'Carne', 'pui': 'Carne', 'piept pui': 'Carne', 'pulpe pui': 'Carne',
  'carne de porc': 'Carne', 'porc': 'Carne', 'cotlet porc': 'Carne', 'ceafa porc': 'Carne',
  'carne de vită': 'Carne', 'vita': 'Carne', 'vită': 'Carne', 'muschi vita': 'Carne',
  'carne de miel': 'Carne', 'miel': 'Carne',
  'carne de curcan': 'Carne', 'curcan': 'Carne',
  'cârnați': 'Carne', 'carnati': 'Carne', 'cârnat': 'Carne', 'carnat': 'Carne',
  'șuncă': 'Carne', 'sunca': 'Carne', 'șuncă feliată': 'Carne', 'sunca feliata': 'Carne',
  'slănină': 'Carne', 'slanina': 'Carne',
  'pastrama': 'Carne', 'pastramă': 'Carne',
  'șnițel': 'Carne', 'snitel': 'Carne',
  'pește': 'Carne', 'peste': 'Carne', 'somon': 'Carne', 'ton': 'Carne', 'cod': 'Carne',
  'sardine': 'Carne', 'creveți': 'Carne', 'creveti': 'Carne',

  // Lactate
  'lapte': 'Lactate', 'lpt': 'Lactate',
  'iaurt': 'Lactate', 'iaurturi': 'Lactate', 'iurt': 'Lactate',
  'brânză': 'Lactate', 'branza': 'Lactate', 'branzeturi': 'Lactate', 'brnz': 'Lactate',
  'telemea': 'Lactate', 'tlm': 'Lactate',
  'caș': 'Lactate', 'cas': 'Lactate',
  'smântână': 'Lactate', 'smantana': 'Lactate',
  'unt': 'Lactate', 'margarina': 'Lactate',
  'brânză topită': 'Lactate', 'branza topita': 'Lactate',

  // Ouă
  'ou': 'Ouă', 'ouă': 'Ouă', 'oua': 'Ouă',

  // Condimente și ingrediente
  'ulei': 'Condimente', 'ulei de floarea soarelui': 'Condimente', 'ulei de masline': 'Condimente',
  'zahăr': 'Condimente', 'zahar': 'Condimente',
  'făină': 'Condimente', 'faina': 'Condimente',
  'sare': 'Condimente', 'piper': 'Condimente',
  'miere': 'Condimente', 'sos': 'Condimente',
  'ketchup': 'Condimente', 'maioneză': 'Condimente', 'maioneza': 'Condimente',
  'orez': 'Condimente', 'paste': 'Condimente', 'fasole': 'Condimente', 'mazăre': 'Condimente', 'mazare': 'Condimente',

  // Băuturi
  'apă': 'Băuturi', 'apa': 'Băuturi', 'suc': 'Băuturi', 'sucuri': 'Băuturi',
  'bere': 'Băuturi', 'vin': 'Băuturi', 'cafea': 'Băuturi', 'ceai': 'Băuturi',

  // Pâine și panificație
  'pâine': 'Pâine & Panificație', 'paine': 'Pâine & Panificație',
  'chiflă': 'Pâine & Panificație', 'chifla': 'Pâine & Panificație',
  'corn': 'Pâine & Panificație',
  'baghetă': 'Pâine & Panificație', 'bagheta': 'Pâine & Panificație',

  // Dulciuri și snacks
  'ciocolată': 'Dulciuri', 'ciocolata': 'Dulciuri', 'biscuit': 'Dulciuri', 'biscuiti': 'Dulciuri',
  'napolitane': 'Dulciuri', 'ciocolată albă': 'Dulciuri', 'ciocolata alba': 'Dulciuri',
  'bomboane': 'Dulciuri', 'chips': 'Dulciuri', 'sticks': 'Dulciuri'
};

// Incarca lista din localStorage sau initializeaza empty
let lista = JSON.parse(localStorage.getItem("listaCumparaturi")) || [];

// Functie de detectare categorie
function detecteazaCategorie(nume) {
    nume = nume.toLowerCase();
    for (const [categorie, cuvinte] of Object.entries(categorii)) {
        if (cuvinte.some(c => nume.includes(c))) return categorie;
    }
    return "Altele";
}

// Functie de adaugare produs
function adaugaProdus(nume) {
    const categorie = detecteazaCategorie(nume);
    lista.push({nume, categorie});
    localStorage.setItem("listaCumparaturi", JSON.stringify(lista));
    afiseazaLista();
}

// Functie de afisare lista
function afiseazaLista() {
    const container = document.getElementById("lista");
    container.innerHTML = "";

    // Sorteaza pe categorii
    const grupat = {};
    lista.forEach(item => {
        if (!grupat[item.categorie]) grupat[item.categorie] = [];
        grupat[item.categorie].push(item.nume);
    });

    for (const [categorie, produse] of Object.entries(grupat)) {
        const h3 = document.createElement("h3");
        h3.textContent = categorie;
        container.appendChild(h3);

        const ul = document.createElement("ul");
        produse.forEach(p => {
            const li = document.createElement("li");
            li.textContent = p;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }
}

// Form submit
document.getElementById("formProdus").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("inputProdus");
    if (input.value.trim() !== "") {
        adaugaProdus(input.value.trim());
        input.value = "";
    }
});

// Initial display
afiseazaLista();
