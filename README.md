# TaskFlow

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-111827?style=for-the-badge&logo=vercel&logoColor=white)](https://taskflow-fullstack-xi.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-1f2937?style=for-the-badge&logo=render&logoColor=white)](https://taskflow-fullstack-g80p.onrender.com/api/docs)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-0f172a?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Thilak-devx/taskflow-fullstack)

TaskFlow is a production-style full-stack task management application built for portfolio and internship evaluation. It demonstrates practical full-stack engineering across authentication, protected CRUD flows, API design, deployment, validation, and UI quality.

The project uses a React + Vite frontend and a Node.js + Express + MongoDB backend, with a modular architecture and deployment-ready configuration for Vercel and Render.

## Live Demo & Deployment

- Frontend live URL: [https://taskflow-fullstack-xi.vercel.app](https://taskflow-fullstack-xi.vercel.app)
- Backend API live URL: [https://taskflow-fullstack-g80p.onrender.com](https://taskflow-fullstack-g80p.onrender.com)
- Swagger API docs: [https://taskflow-fullstack-g80p.onrender.com/api/docs](https://taskflow-fullstack-g80p.onrender.com/api/docs)
- GitHub repository: [https://github.com/Thilak-devx/taskflow-fullstack](https://github.com/Thilak-devx/taskflow-fullstack)

## Overview

TaskFlow is designed to feel like a real SaaS product rather than a basic CRUD demo. It includes:

- secure JWT authentication
- email/password login and Google sign-in support
- role-aware protected routes
- task creation, updates, filtering, and status management
- account settings and password change flows
- permanent account deletion with owned-task cleanup
- production-ready backend middleware and API documentation

This repository is intended to showcase:

- frontend and backend integration
- secure auth implementation
- API-first backend design
- deployment readiness
- code organization and maintainability

## Repository quality

- No local `.env` files are tracked in Git
- `node_modules` and frontend build output are ignored
- Backend and frontend are separated into clean deployment units
- Swagger and Postman are both included for API evaluation
- Live production links are documented for quick reviewer access

## Core features

### User experience

- Responsive dark SaaS dashboard
- Persistent login after refresh
- Toast-based success and error feedback
- Search, filter, and sort for tasks
- Modal-based create and edit flows
- Settings page for profile and security updates

### Authentication and security

- bcrypt password hashing
- JWT-based authentication
- token invalidation through `tokenVersion`
- protected API routes
- role-based access support for `user` and `admin`
- input validation with `express-validator`
- `helmet`, rate limiting, and CORS controls

### Backend quality

- MVC-inspired modular structure
- centralized error handling
- API versioning with `/api/v1`
- Swagger documentation with request/response examples
- Render and Railway deployment support

## Tech stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- Helmet
- express-rate-limit
- Swagger UI Express

## Architecture

The repository is split into independent frontend and backend applications for cleaner development and deployment boundaries.

```text
taskflow-project/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    .env.example
    package.json
    render.yaml
    railway.json
  frontend/
    public/
    src/
      components/
      context/
      pages/
      services/
      utils/
    .env.example
    package.json
    vercel.json
  postman/
    TaskFlow.postman_collection.json
  README.md
```

## Authentication flow

1. A user registers or logs in from the frontend.
2. The backend validates the request and hashes local passwords with `bcryptjs`.
3. On success, the backend returns a signed JWT.
4. The frontend stores the token and sends it as `Authorization: Bearer <token>`.
5. Protected routes verify the token, load the active user, and enforce authorization rules.
6. Password changes increment `tokenVersion`, which invalidates older sessions.

## API documentation

Interactive Swagger documentation is available at:

- Local: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- Production: [https://taskflow-fullstack-g80p.onrender.com/api/docs](https://taskflow-fullstack-g80p.onrender.com/api/docs)

The docs include:

- auth routes
- account routes
- task CRUD routes
- JWT authorization support
- request schemas
- response examples
- status codes

Postman collection:

- [postman/TaskFlow.postman_collection.json](C:/Users/2026/Desktop/taskflow-project/postman/TaskFlow.postman_collection.json)
- Default local base URL: `http://localhost:5000/api/v1`
- Production base URL: `https://taskflow-fullstack-g80p.onrender.com/api/v1`

## API summary

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `GET /api/v1/auth/me`

### Account

- `GET /api/v1/account/profile`
- `PATCH /api/v1/account/profile`
- `POST /api/v1/account/password`
- `DELETE /api/v1/account`

### Tasks

- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

## Environment variables

### Backend

Create [backend/.env](C:/Users/2026/Desktop/taskflow-project/backend/.env) from [backend/.env.example](C:/Users/2026/Desktop/taskflow-project/backend/.env.example).

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-uri
DATABASE_URL=
JWT_SECRET=your-strong-secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CLIENT_URL=http://localhost:5173
CLIENT_URLS=
CORS_ORIGIN_REGEX=
ALLOW_VERCEL_PREVIEW_ORIGINS=true
GOOGLE_CLIENT_ID=your-google-web-client-id
LOG_LEVEL=info
```

### Frontend

Create `frontend/.env` from [frontend/.env.example](C:/Users/2026/Desktop/taskflow-project/frontend/.env.example).

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id
```

## Run locally

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

- Create `backend/.env`
- Create `frontend/.env`
- Add your MongoDB Atlas connection string
- Add a strong JWT secret
- Add Google OAuth client IDs if using Google sign-in

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

### 5. Open the application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Swagger docs: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Scripts

### Backend

- `npm run dev` - start backend with nodemon
- `npm start` - start backend in production mode
- `npm run check` - load-check the Express app configuration

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - create the production build
- `npm run preview` - preview the production build locally

## Deployment Architecture

TaskFlow is deployed as a separated full-stack system:

- Frontend hosted on Vercel for fast static delivery and client-side routing support
- Backend hosted on Render as a Node.js web service exposing the REST API
- MongoDB Atlas used as the managed cloud database for persistent application data

This separation keeps frontend delivery, backend compute, and database persistence independently scalable and easier to manage in production.

## Production Deployment

### Frontend on Vercel

Configuration is included in [frontend/vercel.json](C:/Users/2026/Desktop/taskflow-project/frontend/vercel.json).

Production frontend:

- URL: [https://taskflow-fullstack-xi.vercel.app](https://taskflow-fullstack-xi.vercel.app)
- Hosting: Vercel

Set:

- `VITE_API_URL=https://taskflow-fullstack-g80p.onrender.com/api/v1`
- `VITE_GOOGLE_CLIENT_ID=your-google-web-client-id`

### Backend on Render

Configuration is included in [backend/render.yaml](C:/Users/2026/Desktop/taskflow-project/backend/render.yaml).

Production backend:

- URL: [https://taskflow-fullstack-g80p.onrender.com](https://taskflow-fullstack-g80p.onrender.com)
- Hosting: Render

Recommended production variables:

- `NODE_ENV=production`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `MONGO_URI` or `DATABASE_URL`
- `CLIENT_URL=https://taskflow-fullstack-xi.vercel.app`
- `CLIENT_URLS=https://taskflow-fullstack-xi.vercel.app`
- `ALLOW_VERCEL_PREVIEW_ORIGINS=true`
- `GOOGLE_CLIENT_ID`
- `BCRYPT_SALT_ROUNDS=10`

Runtime notes:

- Start command: `npm start`
- Health check path: `/health`
- API docs path: `/api/docs`

### Environment variables overview

Frontend environment variables:

- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

Backend environment variables:

- `NODE_ENV`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `MONGO_URI` or `DATABASE_URL`
- `CLIENT_URL`
- `CLIENT_URLS`
- `CORS_ORIGIN_REGEX`
- `ALLOW_VERCEL_PREVIEW_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `BCRYPT_SALT_ROUNDS`
- `LOG_LEVEL`

Reviewer note:

- For local testing, keep `baseUrl=http://localhost:5000/api/v1` in Postman.
- For deployed API testing, switch to `productionBaseUrl=https://taskflow-fullstack-g80p.onrender.com/api/v1`.

### Backend on Railway

Configuration is included in [backend/railway.json](C:/Users/2026/Desktop/taskflow-project/backend/railway.json).

## Scalability

TaskFlow is structured with scalability in mind:

- The backend uses a modular architecture with separate controllers, services, middleware, models, and utilities.
- API versioning through `/api/v1` supports future iteration without breaking existing clients.
- JWT-based authentication allows stateless request handling and supports horizontal scaling.
- The frontend and backend are deployed independently, which keeps scaling and release workflows flexible.
- The current architecture can be extended with Redis caching, queues, and background workers as the product grows.
- Deployment configuration for Vercel, Render, and Railway makes the project easy to move from local development to production hosting.

## Reviewer notes

- Swagger docs can be used to test the backend without running the frontend.
- A complete Postman collection is included for manual API review.
- The backend returns consistent JSON success and error payloads.
- Local development and production deployment use the same API structure.
- The project emphasizes practical engineering quality, not only visual polish.
