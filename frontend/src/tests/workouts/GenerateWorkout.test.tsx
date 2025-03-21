import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GenerateWorkout from '../../pages/workouts/GenerateWorkout';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Create mock functions for the Redux actions
const mockGenerateWorkout = jest.fn();
const mockResetWorkoutGenerator = jest.fn();
const mockSetPreferences = jest.fn();
const mockSaveGeneratedWorkout = jest.fn();

// Mock the entire module
jest.mock('../../features/workoutGenerator/workoutGeneratorSlice', () => ({
  generateWorkout: (...args: any[]) => {
    mockGenerateWorkout(...args);
    return { type: 'mocked-action' }; // Return a mock action
  },
  resetWorkoutGenerator: () => {
    mockResetWorkoutGenerator();
    return { type: 'mocked-reset-action' };
  },
  setPreferences: (...args: any[]) => {
    mockSetPreferences(...args);
    return { type: 'mocked-set-preferences-action' };
  },
  saveGeneratedWorkout: (...args: any[]) => {
    mockSaveGeneratedWorkout(...args);
    return { type: 'mocked-save-action' };
  }
}));

describe('GenerateWorkout Component', () => {
  let store: any;

  beforeEach(() => {
    // Reset all mocks before each test
    mockGenerateWorkout.mockReset();
    mockResetWorkoutGenerator.mockReset();
    mockSetPreferences.mockReset();
    mockSaveGeneratedWorkout.mockReset();
    
    store = mockStore({
      workoutGenerator: {
        loading: false,
        error: null,
        workoutPlan: null,
        success: false
      }
    });
  });

  it('renders the component with form fields', () => {
    render(
      <Provider store={store} children={undefined}>
        <GenerateWorkout />
      </Provider>
    );

    // Check if form elements are present
    expect(screen.getByText(/Generate Custom Workout Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Fitness Goal/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Days/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferred Workout Types/i)).toBeInTheDocument();
    expect(screen.getByText(/Equipment Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Workout Plan/i)).toBeInTheDocument();
  });

  it('allows filling out the form and submits data', async () => {
    render(
      <Provider store={store} children={undefined}>
        <GenerateWorkout />
      </Provider>
    );

    // Fill out the form
    fireEvent.click(screen.getByLabelText(/Weight Loss/i));
    fireEvent.click(screen.getByLabelText(/Intermediate/i));
    
    // Set workout days per week
    const daysInput = screen.getByLabelText(/Workout Days Per Week/i);
    fireEvent.change(daysInput, { target: { value: '4' } });
    
    // Set workout duration
    const durationInput = screen.getByLabelText(/Workout Duration/i);
    fireEvent.change(durationInput, { target: { value: '45' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/Generate Workout Plan/i));
    
    await waitFor(() => {
      // Check that setPreferences and generateWorkout were called
      expect(mockSetPreferences).toHaveBeenCalled();
      expect(mockGenerateWorkout).toHaveBeenCalled();
    });
  });

  it('shows loading indicator when submitting', () => {
    store = mockStore({
      workoutGenerator: {
        loading: true,
        error: null,
        workoutPlan: null,
        success: false
      }
    });

    render(
      <Provider store={store} children={undefined}>
        <GenerateWorkout />
      </Provider>
    );

    // CircularProgress should be visible when loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when API returns an error', () => {
    store = mockStore({
      workoutGenerator: {
        loading: false,
        error: 'Failed to generate workout plan',
        workoutPlan: null,
        success: false
      }
    });

    render(
      <Provider store={store} children={undefined}>
        <GenerateWorkout />
      </Provider>
    );

    expect(screen.getByText(/Failed to generate workout plan/i)).toBeInTheDocument();
  });
});
