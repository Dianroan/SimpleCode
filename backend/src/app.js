import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import 'dotenv/config';
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
