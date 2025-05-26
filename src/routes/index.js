const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.use(cors());

router.get('/', (req, res) => {
  res.send('API SportX corriendo');
});

// Ruta para probar conexión a DB
router.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json({ server_time: results[0].now });
  });
});

router.get('/productos/index', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY RANDOM() LIMIT 4');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error del servidor');
  }
});

router.get('/p/productos/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error del servidor');
  }
});

// Clave secreta para firmar el token (guárdala segura en producción)
const JWT_SECRET = 'tu_clave_secreta_segura';

// Ruta de registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  try {
    // Verifica si el usuario ya existe
    const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el nuevo usuario en la base de datos
    const result = await db.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, email', [nombre, email, hashedPassword]);

    const newUser = result.rows[0];

    // Crea el token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // Responde con el token
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario en la base de datos
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Verifica la contraseña (suponiendo que esté hasheada con bcrypt)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crea el token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error del servidor');
  }
});

// 🛡️ Middleware para verificar token
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token requerido');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Token inválido');
  }
}

// 📦 Ruta protegida de ejemplo
router.get('/productos', verificarToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
