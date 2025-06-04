const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

// Importar rutas adicionales
const registerRoutes = require('./register');
const loginRoute = require('./login');
router.use(cors());

// Montar subrutas
router.use('/register', registerRoutes); // <-- Esto expone /api/register
router.use('/login', loginRoute);


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

router.get('/email/usuario', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'El email es obligatorio' });
  }

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error al obtener el ID del usuario:', err);
    res.status(500).send('Error del servidor');
  }
});

// Obtener ventas por ID de usuario
router.get('/ventas/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM ventas WHERE id_usuarios = $1 ORDER BY date DESC',
      [id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ventas para este usuario' });
    }

    res.json(result.rows); // Devuelve todas las ventas del usuario en formato JSON
  } catch (err) {
    console.error('Error al obtener ventas del usuario:', err);
    res.status(500).json({ message: 'Error del servidor al obtener las ventas' });
  }
});


router.post('/ventas', async (req, res) => {
  const { price, usuario_id } = req.body;

  // Validación de campos obligatorios
  if (!price || !usuario_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const date = new Date();

  try {
    const result = await db.query(
      'INSERT INTO ventas (price, id_usuarios, date) VALUES ($1, $2, $3) RETURNING *',
      [price, usuario_id, date]
    );

    res.status(201).json({ message: 'Venta registrada exitosamente', venta: result.rows[0] });
  } catch (err) {
    console.error('Error al registrar venta:', err);
    res.status(500).json({ message: 'Error del servidor al registrar la venta' });
  }
});





module.exports = router;
