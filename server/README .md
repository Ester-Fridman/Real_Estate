# Real Estate Business Management API

A backend system for managing a small real estate business, enabling property services, appointment scheduling, user management, and business information handling.

This project was developed as part of a Node.js web development course, focusing on robust architecture, security, testing, and database integration.

---

## 🚀 Technologies Used

- **Node.js** – Backend runtime environment
- **Express.js** – HTTP server framework
- **MongoDB** – NoSQL database
- **Mongoose** – ORM for MongoDB
- **JWT** – Token-based authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment variable management
- **Jest** – Unit testing
- **Log4js** – Logging
- **Swagger** – Interactive API documentation
- **ESLint** – Code linting and style guide enforcement

---

## 📁 Project Structure

```
project-root/
├── controllers/      ← Controllers for each entity (users, business, services, meetings)
├── services/         ← Business logic per entity
├── models/           ← Mongoose schemas
├── routes/           ← RESTful route definitions
├── middleware/       ← Token auth, role-based permissions, etc.
├── config/           ← Database connection, environment variables
├── tests/            ← Unit tests using Jest
├── app.js            ← Entry point to initialize the server
└── README.md         ← Project documentation
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ester-Fridman/Real_Estate.git
cd your-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/real_estate_db
JWT_SECRET=XXXXXXX
NODE_ENV=XXXXXXX
GOOGLE_CLIENT_ID=XXXXXXXXXXXX 
GOOGLE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXX
```

### 4. Start the Server
```bash
npm start
```

---

## ✅ Testing

To run unit tests using Jest:
```bash
npm test
```

Test files are located in the `tests/` directory (e.g., `user.test.js`) and include at least 3 test cases for validation, database save, and default values.

---

## 🔐 Authentication & Authorization

- **Signup (`/auth/signup`)** and **Login (`/auth/signin`)** endpoints use bcrypt to hash passwords.
- JWTs are used for all protected API routes.
- Middleware ensures valid tokens and enforces role-based access (e.g., `admin`).

---

## 📂 Main Features

- **Users**: Signup, login, and admin-only user management
- **Business**: Create and update real estate business info
- **Services**: Add, update, delete property services
- **Meetings**:
  - Schedule appointments (open to clients)
  - Prevent double booking (returns 400 error if time slot already taken)
  - Admins can update or delete meetings

---

## ✨ Advanced Features Implemented

- ✅ Environment variable handling via `dotenv`
- ✅ Logging with `log4js`
- ✅ Swagger for interactive API documentation
- ✅ Role-based authorization

---

## 🧠 Idea and Inspiration

This system was designed for small real estate professionals who want to manage their services and appointments efficiently, ensuring no overlaps and secure access per user role.

---

## 🧑‍💻 Credits

Developed by: [Your Name Here]  
Guided by: Node.js Course Team


