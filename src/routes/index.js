const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');

// Importar rutas adicionales
const registerRoutes = require('./register');

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


// 🔐 Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Opcional: crear token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secreto', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});


module.exports = router;
