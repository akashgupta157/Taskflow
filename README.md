# TaskFlow - Project & Task Management System

A full-stack project and task management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, role-based access control, and real-time updates.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication with HTTP-only cookies
  - Role-based access control (Admin & Team Members)
  - Secure password hashing with bcrypt

- **Project Management**
  - Create, view, update, and delete projects
  - View all projects with sorting and filtering
  - Project statistics and analytics

- **Task Management**
  - Create tasks with titles, descriptions, priorities, and due dates
  - Assign tasks to team members
  - Update task status (Pending, In Progress, Completed)
  - Filter tasks by status or assigned user

- **Comments System**
  - Add comments to tasks
  - View comment history with timestamps
  - Mention team members in comments

- **Security Features**
  - Rate limiting to prevent API abuse
  - Helmet for secure HTTP headers
  - XSS and NoSQL injection protection
  - CSRF protection

## Tech Stack

**Frontend:**
- React.js with Vite
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Tailwind CSS with ShadCN components
- React Hook Form for forms
- Zod for schema validation

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Express Rate Limit for API protection
- Express Validator for input validation

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/akashgupta157/Taskflow
   cd taskflow/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongo_url
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the server:
   ```bash
   nodmon
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3000/
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```


## Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel/Netlify)
1. Create a new project on Vercel/Netlify
2. Connect your GitHub repository
3. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL
4. Deploy!

## Environment Variables

### Backend (Server)
| Variable      | Description                         | Default               |
|---------------|-------------------------------------|-----------------------|
| PORT          | Server port                         | 3000                  |
| MONGO_URI     | MongoDB connection string           |                       |
| JWT_SECRET    | Secret for JWT signing              |                       |

### Frontend (Client)
| Variable      | Description                         | Default               |
|---------------|-------------------------------------|-----------------------|
| VITE_BACKEND_URL  | Backend API base URL                | http://localhost:3000 |

