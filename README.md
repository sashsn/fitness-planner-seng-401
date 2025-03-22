# Fitness Planner

Fitness Planner is a comprehensive application designed to help users track their workouts, nutrition, and fitness goals. The application includes both a frontend built with React and a backend built with Node.js and Express.

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Profile Management**: Users can update their profile information.
- **Workout Tracking**: Log workouts with exercises, sets, reps, and weights.
- **Nutrition Logging**: Track daily meals and nutritional intake.
- **Fitness Goals**: Set and track fitness goals.
- **AI-Powered Workout Plans**: Generate personalized workout plans using OpenAI API.
- **Dashboard**: View summarized information and progress.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Redux Toolkit**: A predictable state container for JavaScript apps.
- **React Router**: Declarative routing for React.
- **Material-UI**: React components for faster and easier web development.
- **Formik**: Build forms in React, without the tears.
- **Yup**: JavaScript schema builder for value parsing and validation.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Chart.js**: Simple yet flexible JavaScript charting for designers & developers.
- **date-fns**: Modern JavaScript date utility library.

### Backend

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Sequelize**: Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **PostgreSQL**: The world's most advanced open-source relational database.
- **JWT**: JSON Web Tokens for secure authentication.
- **Winston**: A logger for just about everything.
- **Joi**: Object schema description language and validator for JavaScript objects.
- **OpenAI API**: AI-powered workout plan generation.

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fitness-planner.git
   cd fitness-planner
   ```

2. Install dependencies for the backend:
   ```bash
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory with the following contents:
     ```env
     PORT=5000
     NODE_ENV=development
     JWT_SECRET=your_jwt_secret
     DB_HOST=your_database_host
     DB_PORT=5432
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=fitness_planner
     CORS_ORIGIN=http://localhost:3000
     ```

   - Create a `.env` file in the `frontend` directory with the following contents:
     ```env
     REACT_APP_API_URL=http://localhost:5000/api
     REACT_APP_NAME=Fitness Planner
     ```

5. Set up the database:
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Running the Application

1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

### Building for Production

To create a production build of the frontend:
```bash
cd frontend
npm run build
```

This will create optimized files in the `build` folder.

## Project Structure

```
fitness-planner/
├── .gitignore
├── API.md
├── gitpush.sh
├── package.json
├── Project Proposal SENG401 - Group 12.pdf
├── docs/
│   ├── ai-setup.md
│   └── llm-setup.md
├── frontend/
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── public/
│   │   ├── 401-login.png
│   │   ├── index.html
│   │   ├── logo-main.png
│   │   ├── Logo.png
│   │   └── manifest.json
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       ├── reportWebVitals.ts
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── store.ts
│       ├── theme.ts
│       └── utils/
├── logs/
│   ├── combined.log
│   └── error.log
├── src/
│   ├── app.js
│   ├── server.js
│   ├── components/
│   │   ├── PlanItem.js
│   │   └── PlanCard.jsx
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── server.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── aiController.js
│   │   ├── goalController.js
│   │   ├── healthController.js
│   │   ├── nutritionController.js
│   │   ├── userController.js
│   │   └── workoutController.js
│   ├── db/
│   │   ├── init.js
│   │   ├── migrations/
│   │   │   ├── 001-initial-schema.js
│   │   │   ├── 20240315_add_generatedPlan_to_workouts.js
│   │   └── seeders/
│   │       ├── 001-demo-users.js
│   │       └── 002-sample-workouts.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── errorMiddleware.js
│   │   ├── notFound.js
│   │   ├── validation.js
│   │   └── validators.js
│   ├── migrations/
│   │   ├── add-deleted-at-column.js
│   ├── models/
│   │   ├── Exercise.js
│   │   ├── FitnessGoal.js
│   │   ├── Nutrition.js
│   │   ├── User.js
│   │   ├── Workout.js
│   │   └── index.js
│   ├── pages/
│   │   └── ViewPlansPage.jsx
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── debugRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── index.js
│   │   ├── nutritionRoutes.js
│   │   ├── userRoutes.js
│   │   └── workoutRoutes.js
│   ├── scripts/
│   │   ├── check-structure.js
│   │   ├── db-setup.js
│   │   ├── run-migrations.js
│   │   ├── test-api-endpoints.js
│   │   └── test-workout-generation.js
│   ├── services/
│   │   ├── goalService.js
│   │   ├── llmService.js
│   │   ├── nutritionService.js
│   │   ├── userService.js
│   │   └── workoutService.js
│   ├── tests/
│   │   ├── setup.js
│   │   └── unit/
│   │       └── services/
│   │           └── userService.test.js
│   └── utils/
│       ├── errors.js
│       ├── logger.js
│       └── seedDB.js
└── README.md
```

## API Documentation

For detailed API documentation, refer to the [API.md](API.md) file.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Authors

- **Chowdhury, Wahid**
- **Leggett, Benjamin**
- **Morshed, M Munem**
- **Paul, Himel**
- **Snigdho, Sadman Shahriar**



