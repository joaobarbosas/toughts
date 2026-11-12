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

**Requirements:** Node.js, npm and a running MySQL server.

```bash
git clone https://github.com/joaobarbosas/toughts.git
cd toughts
npm install
```

The existing `db/conn.js` expects a local MySQL database named `toughts`, username `root` and an empty password. Create the database locally and adjust that connection file for **your own local environment** before running. Never commit actual passwords.

```sql
CREATE DATABASE IF NOT EXISTS toughts;
```

Start the application:

```bash
npm start
```

Then try [http://localhost:3000](http://localhost:3000).

> The application uses `nodemon` in its start script. These instructions describe the repository's current configuration; successful end-to-end startup has not been independently verified.

## Repository notes

- Installed `node_modules/` dependencies are excluded from version control. Run `npm install` after cloning.
- The `npm test` script is a placeholder; **no automated test suite is configured**.
- Database configuration is hardcoded for local development and should be moved to environment variables before deployment.
- This is an educational application, not a production-ready authentication service.

## Author

**João Pedro** · [GitHub](https://github.com/joaobarbosas) · [LinkedIn](https://linkedin.com/in/joaopedrosanchess)
