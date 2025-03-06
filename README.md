# Fitness Planner Application

A comprehensive web application for tracking workouts, nutrition, and fitness goals.

## Features

- User authentication and profile management
- Create and track workout routines
- Log exercises with sets, reps, weights
- Track nutrition and meals
- Set and monitor fitness goals
- Dashboard with progress visualization

## Project Structure

This project is organized as a monorepo containing both backend and frontend:

```
fitness-planner-seng-401/
├── backend/         # Express.js API
└── frontend/        # React application
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- PostgreSQL (v12+ recommended)

### Backend Setup

1. Navigate to the root directory:
   ```bash
   cd fitness-planner-seng-401
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the necessary configuration (see `.env.example`).

4. Set up the database:
   ```bash
   npm run db:setup
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development Workflow

- Backend API documentation is available in the `API.md` file
- Frontend development guide is in the `frontend/README.md` file

## Technologies Used

### Backend
- Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- RESTful API architecture

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material-UI component library
- Formik and Yup for form management
- Chart.js for data visualization

## License

[MIT](LICENSE)



