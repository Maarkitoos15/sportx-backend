const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes'); // rutas generales (productos)
const registerRoute = require('./routes/register'); // ruta específica de registro

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);
app.use('/api', registerRoute); // aquí se añade /api/register

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
