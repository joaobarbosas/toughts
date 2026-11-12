<div align="center">

# 💭 Thoughts Manager

### A Node.js CRUD and Authentication Learning Project

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-Web_App-111827?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

## About

Thoughts Manager is a **learning project** for building a server-rendered web application with user accounts and personal notes ("thoughts"). It demonstrates CRUD workflows, authentication, template rendering and relational database access.

## Features

- User registration and sign-in
- Create, view, edit and delete thoughts
- Search and filter thoughts
- Server-rendered pages using Handlebars

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js, Express |
| Views | Handlebars, HTML, CSS, JavaScript |
| Database | MySQL, Sequelize |
| Authentication | bcryptjs and session-related Express middleware |

## Run locally

**Requirements:** Node.js 22 or newer, npm and a running MySQL server.

```bash
git clone https://github.com/joaobarbosas/toughts.git
cd toughts
npm ci
```

Copy `.env.example` to `.env` and configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and a random `SESSION_SECRET` of at least 32 characters. Use a dedicated local database user and never commit actual passwords.

```sql
CREATE DATABASE IF NOT EXISTS toughts;
```

Start the application:

```bash
node --env-file=.env index.js
```

Then try [http://127.0.0.1:3001](http://127.0.0.1:3001).

> `npm start` runs Node with environment variables already loaded; `npm run dev` uses nodemon. The isolated MySQL CI smoke test verifies startup, registration, login, CRUD and cross-user edit rejection.

## Repository notes

- Installed `node_modules/` dependencies are excluded from version control. Run `npm ci` after cloning.
- `npm test` runs the ownership regression tests; CI also enables the HTTP/MySQL integration test.
- Database and session configuration use environment variables. `.env` files are ignored.
- This is an educational application, not a production-ready authentication service.

## Author

**João Pedro** · [GitHub](https://github.com/joaobarbosas) · [LinkedIn](https://linkedin.com/in/joaopedrosanchess)

## Test configuration and security fixes

Use Node.js 22 or newer. Copy `.env.example` to `.env`, set the database
credentials and generate a random `SESSION_SECRET` of at least 32 characters.
Create an empty MySQL database first; startup synchronizes the learning schema.
Load configuration explicitly with Node's built-in environment-file support:

```bash
npm ci
node --env-file=.env index.js
# http://127.0.0.1:3001
npm test
```

The edit form and update query both restrict access to the session user.
Session cookies use HttpOnly and SameSite=Lax; production also requires HTTPS
and sets Secure (configure the trusted reverse proxy appropriately).

For a **disposable database only**, run the complete HTTP/MySQL smoke test:

```bash
RUN_MYSQL_TESTS=1 node --env-file=.env --test tests/*.test.js
```

This creates synthetic users and a thought, checks login and CRUD, and verifies
that a second user cannot read the edit form or update another user's thought.
The GitHub Actions workflow provisions an isolated MySQL 8 service. Without
`RUN_MYSQL_TESTS=1`, the integration test is explicitly skipped.

Remaining learning-project limitations include no dedicated CSRF tokens,
no login rate limiting, no password reset, synchronous password hashing and
file-based sessions. Do not deploy this as a production authentication system.
