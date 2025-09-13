/** Common config for bookstore. */

// Replace with your actual PostgreSQL credentials
const DB_USER = "postgres";
const DB_PASSWORD = "test"; // <-- use your real password
const DB_HOST = "localhost";
const DB_PORT = 5432;

let DB_URI = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}

module.exports = { DB_URI };