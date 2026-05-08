# TaskFlow

TaskFlow is a full-stack task management application built as a production-style portfolio project. It combines secure JWT authentication, role-aware task access, account management, Google sign-in support, and a polished dark SaaS interface for a realistic end-to-end product showcase.

The project is structured as a React + Vite frontend and an Express + MongoDB backend, with clear separation between UI, API, business logic, and persistence layers.

## Project overview

TaskFlow is designed to demonstrate practical full-stack engineering skills rather than just static UI work. It includes real authentication, protected CRUD flows, backend validation, centralized error handling, deployment-ready configuration, and API documentation that can be tested directly through Swagger.

This makes it suitable for:

- internship submissions
- recruiter portfolio reviews
- full-stack project demos
- API and frontend integration showcases

## Features

### Product features

- Email and password registration/login
- Google sign-in support
- Persistent authenticated sessions
- Role-aware access for `user` and `admin`
- Task create, read, update, and delete
- Task search, filtering, and sorting
- Dashboard metrics and recent activity
- Profile update and password change
- Permanent account deletion with cleanup of owned tasks

### Backend features

- JWT-based authentication
- bcrypt password hashing
- Protected routes and role-based access middleware
- Request validation with `express-validator`
- Centralized error handling
- Swagger API documentation
- Production-ready CORS and rate limiting
- Deployment support for Render and Railway

### Frontend features

- Responsive React + Vite application
- Protected routes
- Toast notifications
- Persistent auth state after refresh
- Premium dark UI
- Modal-based task management flows
- Account settings UI

## Tech stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- Helmet
- express-rate-limit
- Swagger UI Express

## Authentication flow

TaskFlow uses JWT-based authentication for both local and Google sign-in flows.

1. A user registers or logs in through the frontend.
2. The backend validates the request and hashes passwords using `bcryptjs`.
3. On successful authentication, the backend issues a JWT.
4. The frontend stores the token and attaches it to protected API requests using the `Authorization: Bearer <token>` header.
5. Protected backend routes verify the token, load the current user, and enforce role-based access where required.
6. On password change, the backend increments `tokenVersion`, which invalidates older sessions.

## API documentation

Interactive Swagger documentation is available locally at:

- [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

The docs include:

- authentication routes
- account routes
- task CRUD routes
- JWT authorization support
- request/response schemas
- example payloads and status codes

## Folder structure

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
  postman/
    TaskFlow.postman_collection.json
  README.md
```

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

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Configure environment variables

- Create `backend/.env`
- Create `frontend/.env`
- Add your MongoDB Atlas URI
- Add a strong JWT secret
- Add Google client IDs if Google sign-in is enabled

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

### 5. Open the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Swagger docs: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Deployment

### Frontend

Vercel-ready configuration is included in [frontend/vercel.json](C:/Users/2026/Desktop/taskflow-project/frontend/vercel.json).

Recommended frontend environment variables:

- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

### Backend

Render starter config is included in [backend/render.yaml](C:/Users/2026/Desktop/taskflow-project/backend/render.yaml).

Railway config is included in [backend/railway.json](C:/Users/2026/Desktop/taskflow-project/backend/railway.json).

Recommended backend environment variables:

- `NODE_ENV=production`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `MONGO_URI` or `DATABASE_URL`
- `CLIENT_URL`
- `CLIENT_URLS`
- `CORS_ORIGIN_REGEX`
- `ALLOW_VERCEL_PREVIEW_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `BCRYPT_SALT_ROUNDS`

Deployment notes:

- Health check path: `/health`
- Start command: `npm start`
- Swagger docs path: `/api/docs`
- MongoDB Atlas is the intended production database target
- For Vercel deployments, set `CLIENT_URL` to your primary production frontend URL and keep `ALLOW_VERCEL_PREVIEW_ORIGINS=true` if you want preview deployments to work without extra CORS changes.

## Deployment links

Deployment configs included in the repository:

- Render config: [backend/render.yaml](C:/Users/2026/Desktop/taskflow-project/backend/render.yaml)
- Railway config: [backend/railway.json](C:/Users/2026/Desktop/taskflow-project/backend/railway.json)
- Vercel frontend config: [frontend/vercel.json](C:/Users/2026/Desktop/taskflow-project/frontend/vercel.json)

## Scalability notes

TaskFlow is structured with scalability in mind:

- The backend uses a modular architecture with separate controllers, services, middleware, models, and utilities.
- API versioning through `/api/v1` allows future iteration without breaking existing clients.
- JWT-based authentication supports stateless request handling and is well suited for horizontally scaled deployments.
- The frontend and backend are separated into independent applications, which makes scaling and deployment more flexible.
- The current structure is ready for future additions such as Redis caching, queue-based jobs, or background workers.
- Deployment configs for Vercel, Render, and Railway make the project easy to move from local development to production hosting.

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

## Notes for reviewers

- The backend is production-ready for MongoDB deployments.
- Swagger docs can be used to test the API without needing the frontend.
- The project demonstrates full-stack implementation quality across UI, API design, auth, validation, deployment, and developer experience.
