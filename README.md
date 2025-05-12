# 📝 Blog API

A RESTful Blog API built with **Node.js**, **Express**, and **MongoDB**, allowing users to create blog posts, comment, like, and manage user accounts with authentication and role-based authorization.

## 🌐 Live Demo & Documentation

- **Postman Docs**: [https://documenter.getpostman.com/view/33976749/2sB2jAboFo]
- **GitHub Repo**: [https://github.com/mohamedzeidd/Blog-API](https://github.com/mohamedzeidd/Blog-API)

## 🚀 Features

- User authentication (JWT & cookies)
- Role-based access control (admin, user)
- Create, read, update, delete blogs
- Nested comments system
- Like system per blog
- Admin-only user management
- Error handling and validation
- Public and protected API routes

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, Cookies
- **Tools**: Postman, dotenv, Morgan

## 🔐 Authentication

This API uses both **Bearer Tokens** (in headers) and **HTTP-only Cookies** to authenticate users. Middleware ensures only authorized users can access or modify protected resources.

## Install dependencies

npm install

## Create your config.env file

NODE_ENV=development
PORT=3000

DATABASE_LOCAL=mongodb://127.0.0.1:27017/blog-api
DATABASE_REMOTE=<your-production-mongodb-uri>

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d

COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_FROM=Your Name <your@email.com>

## Start the server

`npm run start` for production mode
`npm run start:dev ` for development mode

## 👤 Author

Mohamed Zeid
GitHub: @mohamedzeidd
