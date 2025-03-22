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
     OPENAI_API_KEY=your_openai_api_key
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
   npm start
   ```

3. Or run both backend and frontend concurrently:
   ```bash
   npm run dev:all
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

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
├── API.md                           # API documentation
├── package.json
├── docs/
│   ├── ai-setup.md                  # OpenAI API setup guide
│   └── llm-setup.md                 # LMStudio setup guide
├── frontend/
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── App.tsx                  # Main app component
│       ├── index.tsx                # Entry point
│       ├── components/              # Reusable components
│       │   ├── ui/                  # UI components
│       │   └── workouts/            # Workout-related components
│       ├── features/                # Redux Toolkit slices
│       │   ├── auth/                # Authentication slice
│       │   ├── workouts/            # Workouts slice
│       │   ├── nutrition/           # Nutrition slice
│       │   ├── goals/               # Goals slice
│       │   └── workoutGenerator/    # AI workout generator
│       ├── hooks/                   # Custom React hooks
│       ├── layouts/                 # Layout components
│       ├── pages/                   # Page components
│       │   ├── auth/                # Authentication pages
│       │   ├── workouts/            # Workout pages
│       │   ├── nutrition/           # Nutrition pages
│       │   └── goals/               # Goals pages
│       ├── services/                # API services
│       ├── store.ts                 # Redux store configuration
│       ├── theme.ts                 # Material-UI theme configuration
│       └── utils/                   # Utility functions
├── logs/
│   ├── combined.log
│   └── error.log
├── src/
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Request handlers
│   ├── db/                          # Database-related files
│   │   ├── migrations/              # Database migrations
│   │   └── seeders/                 # Database seed data
│   ├── middleware/                  # Express middleware
│   ├── models/                      # Sequelize models
│   ├── routes/                      # API routes
│   ├── scripts/                     # Utility scripts
│   ├── services/                    # Business logic
│   ├── tests/                       # Test files
│   └── utils/                       # Utility functions
└── README.md                        # This file
```

## API Documentation

For detailed API documentation, refer to the [API.md](API.md) file.

## Testing

Run tests using Jest:
```bash
npm test
```

For frontend testing:
```bash
cd frontend
npm test
```

## AI-Powered Features

This application leverages the OpenAI API to generate personalized workout plans. To use this feature:

1. Make sure you have an OpenAI API key in your `.env` file.
2. Navigate to the workout generator page.
3. Fill in your preferences (fitness goals, experience level, available equipment, etc.).
4. The application will generate a customized workout plan tailored to your needs.

For setup instructions, see [ai-setup.md](docs/ai-setup.md).

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


