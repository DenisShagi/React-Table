const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json());

// Настраиваем соединение с PostgreSQL
const pool = new Pool({
  user: 'postgres',      // Ваш пользователь
  host: 'localhost',     // Хост, где стоит PostgreSQL
  database: 'manual_db', // Ваша база
  password: 'postgresql',  // Пароль
  port: 5432,            // Порт PostgreSQL
});

// Пример эндпоинта GET /api/manual/value/2025-02-01
app.get('/api/manual/value/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await pool.query(
      `SELECT row_id, initial_value, expense, remainder, change_time
       FROM manual_value
       WHERE DATE(change_time) = $1
       ORDER BY row_id ASC;`,
      [date]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

// Пример эндпоинта PUT /api/manual/value/123 (редактирование)
app.put('/api/manual/value/:id', async (req, res) => {
  const { id } = req.params;
  const { initial_value, expense, remainder, change_time } = req.body;
  try {
    await pool.query(
      `UPDATE manual_value
       SET initial_value = $1, expense = $2, remainder = $3, change_time = $4
       WHERE row_id = $5;`,
      [initial_value, expense, remainder, change_time, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

// Запускаем сервер на порту 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
