# Fitness Planner API Documentation

This document provides detailed information about the Fitness Planner API endpoints.

## Base URL

All API endpoints are relative to: `/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error responses:

```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

## Endpoints

### User Management

#### Register a new user

- **URL**: `/users/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "height": 175,
    "weight": 75
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "user": {
        "id": "uuid",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01",
        "height": 175,
        "weight": 75,
        "role": "user",
        "isActive": true
      },
      "token": "jwt_token_here"
    }
    ```

#### Login

- **URL**: `/users/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "user": {
        "id": "uuid",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "jwt_token_here"
    }
    ```

#### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "height": 175,
      "weight": 75,
      "role": "user",
      "isActive": true
    }
    ```

#### Update User Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "firstName": "Johnny",
    "weight": 73
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Updated user object

#### Delete User Account

- **URL**: `/users/profile`
- **Method**: `DELETE`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `204 No Content`

### Workouts

#### Create a new workout

- **URL**: `/workouts`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Morning Run",
    "description": "5K run in the park",
    "date": "2023-04-15T08:00:00Z",
    "duration": 30,
    "caloriesBurned": 300,
    "workoutType": "cardio"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created workout object

#### Get all workouts

- **URL**: `/workouts`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Array of workout objects

#### Get workout by ID

- **URL**: `/workouts/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Workout object with exercises

#### Update workout

- **URL**: `/workouts/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Evening Run",
    "duration": 45
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Updated workout object

#### Delete workout

- **URL**: `/workouts/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `204 No Content`

### Exercises

#### Add exercise to workout

- **URL**: `/workouts/:workoutId/exercises`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Push-ups",
    "sets": 3,
    "reps": 15,
    "notes": "Keep proper form"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created exercise object

### Nutrition

#### Create a new meal entry

- **URL**: `/nutrition/meals`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Breakfast",
    "date": "2023-04-15T08:00:00Z",
    "mealType": "breakfast",
    "calories": 450,
    "protein": 20,
    "carbs": 50,
    "fat": 15
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created meal object

#### Get nutrition summary

- **URL**: `/nutrition/summary`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Nutrition summary object

### Fitness Goals

#### Create a new fitness goal

- **URL**: `/goals`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Weight Loss",
    "description": "Lose 5kg by summer",
    "goalType": "weight",
    "targetValue": 70,
    "currentValue": 75,
    "unit": "kg",
    "startDate": "2023-04-01T00:00:00Z",
    "targetDate": "2023-07-01T00:00:00Z"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created fitness goal object

#### Get all fitness goals

- **URL**: `/goals`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Array of fitness goal objects

#### Get fitness goal by ID

- **URL**: `/goals/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Fitness goal object

#### Update fitness goal

- **URL**: `/goals/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "currentValue": 72,
    "isCompleted": false
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Updated fitness goal object

#### Delete fitness goal

- **URL**: `/goals/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Success Response**:
  - **Code**: `204 No Content`

## Data Models

### User

```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "date",
  "height": "number",
  "weight": "number",
  "role": "string (user or admin)",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Workout

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "description": "string",
  "date": "datetime",
  "duration": "number (minutes)",
  "caloriesBurned": "number",
  "workoutType": "string (cardio, strength, flexibility, balance, other)",
  "isCompleted": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "exercises": ["array of exercise objects"]
}
```

### Exercise

```json
{
  "id": "uuid",
  "workoutId": "uuid",
  "name": "string",
  "description": "string",
  "sets": "number",
  "reps": "number",
  "weight": "number",
  "duration": "number (seconds)",
  "distance": "number",
  "restTime": "number (seconds)",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Nutrition/Meal

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "date": "datetime",
  "mealType": "string (breakfast, lunch, dinner, snack)",
  "calories": "number",
  "protein": "number (grams)",
  "carbs": "number (grams)",
  "fat": "number (grams)",
  "description": "string",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Fitness Goal

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "description": "string",
  "goalType": "string (weight, strength, endurance, nutrition, other)",
  "targetValue": "number",
  "currentValue": "number",
  "unit": "string",
  "startDate": "datetime",
  "targetDate": "datetime",
  "isCompleted": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```
