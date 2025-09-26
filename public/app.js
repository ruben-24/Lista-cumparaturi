const socket = io();

const itemName = document.getElementById('itemName');
const itemQty = document.getElementById('itemQty');
const itemCategory = document.getElementById('itemCategory');
const addBtn = document.getElementById('addBtn');
const categoriesContainer = document.getElementById('categoriesContainer');

let localState = { items: [] };

addBtn.onclick = () => {
  if (!itemName.value.trim()) return;

  socket.emit('action', {
    type: 'add',
    payload: {
      name: itemName.value.trim(),
      qty: itemQty.value.trim(),
      category: itemCategory.value.trim() || 'Altele'
    }
  });

  itemName.value = '';
  itemQty.value = '';
  itemCategory.value = '';
};

socket.on('state', state => {
  localState = state;
  render();
});

function render() {
  categoriesContainer.innerHTML = '';

  const categories = {};
  localState.items.forEach(it => {
    if (!categories[it.category]) categories[it.category] = [];
    categories[it.category].push(it);
  });

  Object.keys(categories).forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h3');
    title.textContent = cat;
    catDiv.appendChild(title);

    categories[cat].forEach(it => {
      const row = document.createElement('div');
      row.className = 'item';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = it.checked;
      cb.onchange = () => socket.emit('action', { type: 'toggle', payload: { id: it.id } });

      const span = document.createElement('span');
      span.textContent = `${it.name} ${it.qty ? '('+it.qty+')' : ''}`;
      if (it.checked) span.style.textDecoration = 'line-through';

      const del = document.createElement('button');
      del.textContent = 'Șterge';
      del.onclick = () => socket.emit('action', { type: 'delete', payload: { id: it.id } });

      row.append(cb, span, del);
      catDiv.appendChild(row);
    });

    categoriesContainer.appendChild(catDiv);
  });
}
