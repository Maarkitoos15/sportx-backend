const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = 3000; // Fallback por si PORT no está definido

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', routes);

// Listener
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
