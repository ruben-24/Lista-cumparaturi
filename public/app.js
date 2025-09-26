const socket = io();
let localState = { items: [] };

const itemName = document.getElementById('itemName');
const itemQty = document.getElementById('itemQty');
const addBtn = document.getElementById('addBtn');
const categoriesContainer = document.getElementById('categoriesContainer');

addBtn.addEventListener('click', () => {
  const name = itemName.value.trim();
  if (!name) return;
  socket.emit('action', { type: 'add', payload: { name, qty: itemQty.value.trim() } });
  itemName.value = '';
  itemQty.value = '';
});

socket.emit('action', { 
  type: 'add', 
  payload: { 
    name, 
    qty: itemQty.value.trim(),
    category: document.getElementById('itemCategory').value.trim() || 'Altele'
  } 
});

socket.on('state', (s) => {
  localState = s;
  render();
});

function render() {
  categoriesContainer.innerHTML = '';
  localState.items.forEach(it => {
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
    categoriesContainer.appendChild(row);
  });
}
