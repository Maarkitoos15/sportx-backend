const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

// Importar rutas adicionales
const registerRoutes = require('./register');

router.use(cors());

// Montar subrutas
router.use('/register', registerRoutes); // <-- Esto expone /api/register

// Ruta base
router.get('/', (req, res) => {
  res.send('API SportX corriendo');
});

// Productos aleatorios
router.get('/productos/index', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY RANDOM() LIMIT 4');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error del servidor');
  }
});

// Todos los productos
router.get('/p/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
