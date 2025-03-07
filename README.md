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

# Fitness Planner

## AI-Powered Workout Generator

The AI-Powered Workout Generator feature allows users to:

1. Generate personalized workout plans based on their preferences
2. Save generated workout plans to their profile
3. Share workout plans with others
4. Print or download workout plans as PDFs

### How to Use the Workout Generator

1. Navigate to the Workout Generator page from your dashboard
2. Fill out the form with your fitness preferences:
   - Select your fitness goal
   - Choose your experience level
   - Specify workout days and duration
   - Select available equipment
   - Add any limitations or special requirements
3. Click "Generate Workout Plan"
4. Review your custom workout plan
5. Save, print, or share your plan

### Technical Implementation

The workout generator uses OpenAI's GPT model to create personalized workout plans based on user inputs. The implementation includes:

- A React frontend with form validation
- Redux state management for storing workout preferences and plans
- An Express.js backend API that communicates with the OpenAI API
- PDF generation using jsPDF and html2canvas
- Comprehensive error handling and loading states

### Configuration

To use the OpenAI integration, you need to set up your API key:

1. Create a `.env` file in the backend folder
2. Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
3. Set `BYPASS_AUTH=true` for development (optional)

### Example Response Format

The API returns workout plans in the following JSON format:

```json
{
  "workoutPlan": {
    "metadata": {
      "name": "Custom Fitness Plan",
      "goal": "Muscle Gain",
      "fitnessLevel": "Intermediate",
      "durationWeeks": 4,
      "createdAt": "2023-03-15T12:00:00Z"
    },
    "overview": {
      "description": "A progressive program focusing on hypertrophy...",
      "weeklyStructure": "4 days per week, 45 minutes per session",
      "recommendedEquipment": ["Dumbbells", "Bench", "Pull-up Bar"],
      "estimatedTimePerSession": "45 minutes"
    },
    // Additional fields for schedule, nutrition, etc.
  }
}
```




