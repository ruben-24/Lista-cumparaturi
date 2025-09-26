const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const state = { items: [], version: 1 };

io.on('connection', (socket) => {
  socket.emit('state', state);

  socket.on('action', ({ type, payload }) => {
    if (type === 'add') {
      state.items.push({
        id: Date.now().toString(),
        name: payload.name,
        qty: payload.qty || '',
        checked: false,
        category: payload.category || 'Altele'
      });
    } else if (type === 'toggle') {
      const item = state.items.find(i => i.id === payload.id);
      if (item) item.checked = !item.checked;
    } else if (type === 'delete') {
      state.items = state.items.filter(i => i.id !== payload.id);
    }
    state.version++;
    io.emit('state', state);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
