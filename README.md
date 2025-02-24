# AI-Powered Personalized Fitness Planner

## Project Overview

The AI-Powered Personalized Fitness Planner is a MERN-based web application that generates customized workout and meal plans based on user preferences, leveraging LLM (Large Language Model) technology. Users can:

- Register and authenticate securely using JWT.
- Receive AI-generated workout and meal plans based on fitness goals.
- Log workouts and track progress dynamically.
- Receive notifications (Email, SMS, Push) for reminders.
- Use a responsive UI (React.js) and interact with an AI-powered backend (Node.js, Express, MongoDB, OpenAI API).

## Tech Stack

- **Frontend:** React.js (Next.js), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **AI Integration:** OpenAI API (LLM)
- **Authentication:** JWT-based authentication
- **Deployment:** Vercel (Frontend), Render (Backend)

## Project Structure

```
📂 src/
│── controllers/      # Handles API requests (Auth, Profile, Plans, Notifications)
│── services/         # Business logic (User, Plan, Notifications, AI Integration)
│── models/           # MongoDB Schemas (User, FitnessPreferences, Plans, Logs)
│── domain/           # Strategy Pattern for Meal Planshttps://github.com/sashsn/fitness-planner-seng-401/blob/main/README.md
│── patterns/         # Factory, Observer, Singleton Design Patterns
│── utils/            # AI Processing & LLM Requests
│── index.js          # Entry point
│── package.json      # Dependencies & scripts
```

## Function Descriptions

### `src/controllers/AuthController.js`

Handles user authentication and security.

```js
/**
 * @function registerUser
 * @description Registers a new user, hashes password, and stores data.
 * @param {Object} req - Express request object containing user details.
 * @param {Object} res - Express response object.
 */
```

```js
/**
 * @function loginUser
 * @description Validates user credentials and returns a JWT token.
 * @param {Object} req - Express request with email & password.
 * @param {Object} res - Express response with success or failure message.
 */
```

```js
/**
 * @function resetPassword
 * @description Initiates password reset by sending an email with a reset link.
 * @param {Object} req - Express request containing user email.
 * @param {Object} res - Express response confirming request status.
 */
```

### `src/controllers/ProfileController.js`

Manages user profile and fitness preferences.

```js
/**
 * @function viewProfile
 * @description Retrieves user profile details from the database.
 * @param {Object} req - Express request with user ID.
 * @param {Object} res - Express response containing user data.
 */
```

```js
/**
 * @function updateProfile
 * @description Updates user's profile information (height, weight, goal, diet).
 * @param {Object} req - Express request with new profile details.
 * @param {Object} res - Express response confirming update success.
 */
```

### `src/controllers/PlanController.js`

Handles workout plan generation and tracking.

```js
/**
 * @function generatePlan
 * @description Creates a fitness plan using AI (LLMService) based on user data.
 * @param {Object} req - Express request with user ID.
 * @param {Object} res - Express response containing the generated plan.
 */
```

```js
/**
 * @function logWorkout
 * @description Logs completed exercises and updates workout progress.
 * @param {Object} req - Express request containing workout log details.
 * @param {Object} res - Express response confirming workout log success.
 */
```

### `src/controllers/NotificationController.js`

Handles notifications for workout reminders and meal plans.

```js
/**
 * @function setPreferences
 * @description Updates user notification settings (Email, SMS, Push).
 * @param {Object} req - Express request containing notification preferences.
 * @param {Object} res - Express response confirming update.
 */
```

## Services Layer

### `src/services/AuthService.js`

Handles user authentication logic.

```js
/**
 * @function createUser
 * @description Hashes password, creates a user, and stores in MongoDB.
 * @param {Object} userData - User registration details.
 * @returns {Object} Newly created user object.
 */
```

```js
/**
 * @function validateLogin
 * @description Compares password hash and returns JWT token if valid.
 * @param {String} email - User email.
 * @param {String} password - User password.
 * @returns {String} JWT token if authentication is successful.
 */
```

## Design Patterns Implemented

### Factory Pattern (`src/patterns/PlanFactory.js`)

Generates different types of workout plans dynamically.

```js
/**
 * @function createPlan
 * @description Returns a different plan type based on user fitness goal.
 * @param {String} type - Type of workout plan (WeightLoss, MuscleGain, etc.).
 * @returns {Object} An instance of the specific workout plan.
 */
```

### Observer Pattern (`src/patterns/Observer.js`)

Handles notification system with multiple subscribers.

```js
/**
 * @function update
 * @description Defines behavior for notification subscribers (email, SMS).
 * @param {String} eventData - Data for the notification.
 */
```

### Singleton Pattern (`src/patterns/SingletonDatabase.js`)

Ensures a single MongoDB connection instance is used.

```js
/**
 * @function getInstance
 * @description Returns the single instance of the MongoDB connection.
 * @returns {Object} MongoDB connection instance.
 */
```

## How to Run Locally

1. Clone the repository
   ```sh
   git clone https://github.com/sashsn/fitness-planner-seng401.git
   cd fitness-planner
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Set up `.env` file
   ```
   MONGO_URI=<your_mongo_db_url>
   JWT_SECRET=<your_secret_key>
   OPENAI_API_KEY=<your_openai_api_key>
   ```
4. Start the backend server
   ```sh
   npm start
   ```

## Future Enhancements

- React.js Frontend for user interaction
- Graph-based AI Recommendations for better workouts
- Mobile App (React Native) for easy access

## License

MIT License – Free to use and modify

