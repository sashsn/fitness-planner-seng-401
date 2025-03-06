# Fitness Planner Frontend

This is the frontend for the Fitness Planner application. It's built with React, TypeScript, Redux Toolkit, and Material-UI.

## Features

- User authentication and profile management
- Workout tracking with exercises
- Nutrition and meal logging
- Fitness goal setting and progress tracking
- Dashboard with summarized information

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
Create a `.env` file in the frontend directory with the following contents:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_NAME=Fitness Planner
```

### Running the Application

To start the development server:
```bash
npm start
# or
yarn start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

This will create optimized files in the `build` folder.

## Project Structure

```
frontend/
│
├── public/               # Static files
│   ├── index.html        # HTML template
│   ├── favicon.ico       # App icon
│   └── manifest.json     # Web app manifest
│
├── src/                  # Source code
│   ├── components/       # Reusable components
│   │   ├── forms/        # Form components
│   │   └── ui/           # UI components
│   │
│   ├── features/         # Redux Toolkit slices
│   │   ├── auth/         # Authentication slice
│   │   ├── workouts/     # Workouts slice
│   │   ├── nutrition/    # Nutrition slice
│   │   ├── goals/        # Goals slice
│   │   └── profile/      # User profile slice
│   │
│   ├── hooks/            # Custom React hooks
│   │
│   ├── layouts/          # Layout components
│   │
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── workouts/     # Workout pages
│   │   ├── nutrition/    # Nutrition pages
│   │   └── goals/        # Goals pages
│   │
│   ├── services/         # API services
│   │
│   ├── utils/            # Utility functions
│   │
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   ├── store.ts          # Redux store configuration
│   └── theme.ts          # Material-UI theme configuration
│
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type checking
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI** - Component library
- **Formik** - Form management
- **Yup** - Form validation
- **Axios** - API client
- **Chart.js** - Charts and data visualization
- **date-fns** - Date utilities
