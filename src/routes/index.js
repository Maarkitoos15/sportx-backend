const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

router.use(cors());

// Ruta base
router.get('/', (req, res) => {
  res.send('API SportX corriendo');
});

// 🛍️ Ruta para obtener 4 productos aleatorios
router.get('/productos/index', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY RANDOM() LIMIT 4');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error del servidor');
  }
});

// 🛒 Ruta para obtener todos los productos
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
