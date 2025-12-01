### MySQL Setup Guide (Backend)

This project uses MySQL as its database, connected via Node.js (Express).
To make sure everyone has a consistent setup, please follow the steps below.

## 1. Create Your Local Database

Open phpMyAdmin or MySQL Workbench.

Create a new database called:

pride_stem_networking


Make sure your MySQL server is running locally.

## 2. Setup Database Configuration

Each developer will have their own database credentials.
To keep this consistent, we use a shared template file.

Go to the backend folder:

cd backend

Copy the template file:

cp db.config.template.js db.config.js


Open db.config.js and update it with your local credentials:

export default {
  host: "localhost",
  user: "root",
  password: "", // or your local MySQL password
  database: "pride_stem_networking",
};


Note:
The file db.config.js is included in .gitignore, so your personal credentials won’t be pushed to GitLab.

## 3. Database Connection File

The backend automatically connects using the credentials in db.config.js.

Connection file:
backend/db.js

import mysql from "mysql2";
import dbConfig from "./db.config.js";

const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

export default db;

## 4. Starting the Backend

Run the backend from the project root:

cd backend
npm install
npm start


If everything’s working, you should see:

Connected to MySQL Database
Server running on port 5000

## 5. Team Notes

Always use the same database name (pride_stem_networking).

If you add or modify tables, export them via phpMyAdmin and share the .sql file under /backend/sql/.

Avoid pushing personal credentials to Git.