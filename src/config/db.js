const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d0iak5adbo4c739b9ph0-a.frankfurt-postgres.render.com',
  port: 5432,
  database: 'sportx',
  user: 'admin',
  password: 'TCk0JwtiVjeBASKoavVUyJW2Dw3wVr2c',
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;
