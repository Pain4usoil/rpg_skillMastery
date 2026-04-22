const express = require("express");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Если список пуст, разрешаем все origin (удобно для быстрого старта).
    if (allowedOrigins.length === 0) return callback(null, true);
    // Разрешаем запросы без origin (Postman/curl) и whitelist из env.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Подключение к PostgreSQL. DATABASE_URL (Render и др.) или отдельные переменные из .env.
function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
    });
  }
  return new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "auth_demo"
  });
}

const pool = createPool();

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      login VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Безопасная миграция со старой схемы (email -> login).
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS login VARCHAR(255)`);

  const emailColumnCheck = await pool.query(`
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
    LIMIT 1
  `);

  if (emailColumnCheck.rowCount > 0) {
    await pool.query(`UPDATE users SET login = email WHERE login IS NULL AND email IS NOT NULL`);
  }

  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS users_login_unique_idx ON users(login)`);
}

app.post("/api/register", async (req, res) => {
  try {
    const { login, password, confirmPassword } = req.body;

    if (!login || !password || !confirmPassword) {
      return res.status(400).json({ message: "Логин и пароль обязательны" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Пароли не совпадают" });
    }

    const existingUsers = await pool.query("SELECT id FROM users WHERE login = $1", [login]);
    if (existingUsers.rows.length > 0) {
      return res.status(409).json({ message: "Пользователь уже существует" });
    }

    await pool.query("INSERT INTO users (login, password) VALUES ($1, $2)", [login, password]);
    return res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Логин и пароль обязательны" });
    }

    const users = await pool.query("SELECT id FROM users WHERE login = $1 AND password = $2", [
      login,
      password
    ]);
    if (users.rows.length === 0) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    return res.status(200).json({ message: "Авторизация успешна" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/", (_req, res) => {
  res.redirect("/register.html");
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database init failed:", error);
    process.exit(1);
  });
