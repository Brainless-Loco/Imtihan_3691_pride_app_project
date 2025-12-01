# Pride STEM Networking App – Database Setup Guide

**Author:** Zain Abideen  
**Date:** October 2025  
**Purpose:**  
This document outlines how to initialize and access the MySQL database for the Pride STEM Networking App.  
The database is containerized using Docker to ensure consistent setup across all development environments.

---

## Overview

The database stores all application data, including user profiles, posts, and connections.  
This initial setup script (`init.sql`) creates the development database **`prideapp`**, a base **`users`** table,  
and seeds sample data to verify connectivity with the backend.

---

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running  
- MySQL 8.x container (auto-launched from `docker-compose.yml` in the project root)

---

## Setup Instructions

1. **Ensure the MySQL container is running**
   ```bash
   docker ps

You should see a container named prideapp_db or similar.

    Run the initialization script

docker exec -i prideapp_db mysql -u root -prootpass < database/init.sql

Verify that data was inserted

docker exec -it prideapp_db mysql -u root -prootpass -e "USE prideapp; SELECT * FROM users;"

You should see:

    +----+--------+--------------------+---------------------+
    | id | handle | email              | created_at          |
    +----+--------+--------------------+---------------------+
    |  1 | zain   | zain@example.com   | 2025-10-17 19:25:00 |
    |  2 | alex   | alex@example.com   | 2025-10-17 19:25:00 |
    |  3 | river  | river@example.com  | 2025-10-17 19:25:00 |
    +----+--------+--------------------+---------------------+

Connection Details
Variable	Value
Host	localhost
Port	3306
User	prideuser
Password	pridepass
Database	prideapp

These credentials should be referenced in the backend .env file.
Quick Test with Backend

Once the backend is configured, verify the connection by running:

npm run dev

and visiting:

    http://localhost:4000/api/health

http://localhost:4000/api/users

You should see your seeded data returned as JSON.
🧹 Maintenance Tips

    To reset the database:

docker exec -i prideapp_db mysql -u root -prootpass -e "DROP DATABASE prideapp;"
docker exec -i prideapp_db mysql -u root -prootpass < database/init.sql

To back up the data:

docker exec prideapp_db mysqldump -u root -prootpass prideapp > backup.sql