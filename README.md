# Walking Skeleton
# Secure Authentication & JWT Integration

## Project Overview

This project is a full-stack authentication system built using React, Node.js, Express, and MongoDB. It provides secure user registration and login functionality using bcryptjs for password hashing and JSON Web Tokens (JWT) for authentication.

The application allows users to register, log in, access protected routes, and manage tasks through authenticated API requests.

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- cors

## Folder Structure

```text
MISSION-13
│
├── backend
│   ├── config
│   ├── data
│   ├── middleware
│   │   └── auth.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   └── tasks.js
│   │
│   ├── tests
│   │   └── verify-auth.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend
│   ├── public
│   │
│   ├── src
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── node_modules
├── package.json
├── package-lock.json
└── .gitignore
```

## Features

### Authentication

- User Registration
- User Login
- Logout Functionality
- JWT Token Generation
- JWT Verification
- Protected Routes

### Security

- Password Hashing with bcryptjs
- Secure Authentication using JWT
- Authorization Middleware
- Token Validation
- Protected API Endpoints

### Task Management

- Create Tasks
- View Tasks
- Update Tasks
- Protected Task Operations

## Authentication Flow

### Registration

1. User enters name, email, and password.
2. Password is hashed using bcryptjs.
3. User information is stored in MongoDB.
4. Registration completes successfully.

### Login

1. User enters email and password.
2. Server verifies credentials.
3. JWT token is generated.
4. Token is returned to the client.
5. Token is stored in localStorage.

### Authorization

1. User requests protected resources.
2. JWT token is sent in request headers.
3. Middleware validates token.
4. Access is granted only if the token is valid.

## API Endpoints

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

### Update Task

```http
PUT /api/tasks/:id
```

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

Root Folder

```bash
npm install
```

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

## Running the Project

### Start Backend

```bash
cd backend
npm start
```

Backend URL

```text
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend URL

```text
http://localhost:5173
```

## Live deployment

Froentend : https://waling-skeleton.vercel.app/login
Backend : https://waling-skeleton-4.onrender.com/

## Testing

Authentication routes can be tested using:

- Postman
- Thunder Client
- Browser Developer Tools

Test cases:

- Register User
- Login User
- Generate JWT
- Access Protected Route
- Create Task
- Update Task
- Logout User

## Learning Outcomes

Through this project I learned:

- MongoDB Data Modeling
- Express API Development
- Password Hashing using bcryptjs
- JWT Authentication
- Middleware Development
- React Authentication Flow
- Protected Routes
- Context API State Management
- Frontend and Backend Integration

