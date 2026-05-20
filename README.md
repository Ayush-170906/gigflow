# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Lead Management (CRUD)** — Create, view, update, delete leads
- **Advanced Filtering** — Filter by status, source, search by name/email, sort latest/oldest (all combinable)
- **Debounced Search** — 500ms debounce to reduce API calls
- **Backend Pagination** — 10 records per page with skip/limit
- **CSV Export** — Admin-only full export of all leads
- **Role-Based Access Control** — Admin and Sales roles with different permissions
- **Docker Support** — Full docker-compose setup for local and production

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite   |
| Backend   | Node.js, Express, TypeScript              |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT + bcryptjs                            |
| Container | Docker + docker-compose                   |

## Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route handlers (auth, leads)
│   │   ├── middleware/     # Auth, RBAC, error handler
│   │   ├── models/        # Mongoose schemas (User, Lead)
│   │   └── routes/        # Express route definitions
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance + interceptors
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Dashboard, Login, Register
│   │   └── types/         # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/gigflow.git
cd gigflow
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Docker Setup

```bash
# From the root gigflow directory
cp backend/.env.example backend/.env
# Fill in MONGODB_URI, JWT_SECRET in backend/.env

docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint             | Access  | Description         |
|--------|----------------------|---------|---------------------|
| POST   | `/auth/register`     | Public  | Register new user   |
| POST   | `/auth/login`        | Public  | Login, returns JWT  |

### Leads

| Method | Endpoint             | Access       | Description                        |
|--------|----------------------|--------------|------------------------------------|
| GET    | `/leads`             | Private      | Get all leads (filter/search/page) |
| POST   | `/leads`             | Private      | Create a lead                      |
| GET    | `/leads/:id`         | Private      | Get single lead                    |
| PUT    | `/leads/:id`         | Private      | Update lead                        |
| DELETE | `/leads/:id`         | Admin only   | Delete lead                        |
| GET    | `/leads/export`      | Admin only   | Export all leads as CSV            |

### Query Parameters for GET `/leads`

| Param    | Type   | Example          | Description                   |
|----------|--------|------------------|-------------------------------|
| `page`   | number | `?page=2`        | Page number (default: 1)      |
| `limit`  | number | `?limit=10`      | Records per page (default: 10)|
| `status` | string | `?status=New`    | Filter by status              |
| `source` | string | `?source=Website`| Filter by source              |
| `search` | string | `?search=rahul`  | Search name or email          |
| `sort`   | string | `?sort=oldest`   | `latest` or `oldest`          |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

## Roles & Permissions

| Feature        | Admin | Sales |
|----------------|-------|-------|
| View leads     | ✅    | ✅    |
| Create lead    | ✅    | ✅    |
| Edit lead      | ✅    | ✅    |
| Delete lead    | ✅    | ❌    |
| Export CSV     | ✅    | ❌    |

## Author

Ayush Korde — [ayushkorde17@gmail.com](mailto:ayushkorde17@gmail.com)
