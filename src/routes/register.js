const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const cors = require('cors');

router.use(cors());

router.get('/', (req, res) => {
  res.send('API SportX corriendo');
});

// Endpoint para registrar un nuevo usuario
router.post('/auth/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el nuevo usuario
    await db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)',
      [nombre, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
