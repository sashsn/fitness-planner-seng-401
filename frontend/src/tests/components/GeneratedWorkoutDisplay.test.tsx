import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneratedWorkoutDisplay from '../../components/workouts/GeneratedWorkoutDisplay';
import { describe, expect, it, jest } from '@jest/globals';

// Mock workout plan data
const mockWorkoutPlan = {
  workoutPlan: {
    metadata: {
      name: "Custom Test Plan",
      goal: "Muscle Gain",
      fitnessLevel: "Intermediate",
      durationWeeks: 4,
      createdAt: new Date().toISOString()
    },
    overview: {
      description: "This is a test workout plan",
      weeklyStructure: "4 days per week, 45 minutes per session",
      recommendedEquipment: ["Dumbbells", "Bench", "Pull-up Bar"],
      estimatedTimePerSession: "45 minutes"
    },
    schedule: [
      {
        week: 1,
        days: [
          {
            dayOfWeek: "Monday",
            workoutType: "Strength",
            focus: "Upper Body",
            duration: 45,
            exercises: [
              {
                name: "Bench Press",
                category: "Strength",
                targetMuscles: ["Chest", "Triceps"],
                sets: 3,
                reps: 10,
                weight: "Medium",
                restBetweenSets: 60,
                notes: "Focus on form",
                alternatives: ["Push-ups"]
              }
            ],
            warmup: {
              duration: 5,
              description: "Light cardio"
            },
            cooldown: {
              duration: 5,
              description: "Stretching"
            }
          },
          {
            dayOfWeek: "Tuesday",
            isRestDay: true,
            recommendations: "Light walking or yoga"
          }
        ]
      }
    ],
    nutrition: {
      generalGuidelines: "Eat protein with every meal",
      dailyProteinGoal: "1g per pound of body weight",
      mealTimingRecommendation: "Every 3-4 hours"
    },
    progressionPlan: {
      weeklyAdjustments: [
        {
          week: 2,
          adjustments: "Increase weight by 5%"
        }
      ]
    },
    additionalNotes: "Stay hydrated!"
  }
};

// Mock the window.print function
window.print = jest.fn();

// Mock the clipboard API
const mockClipboard = {
  writeText: jest.fn(() => Promise.resolve())
};
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true
});

// Mock the window.alert function
window.alert = jest.fn();

describe('GeneratedWorkoutDisplay Component', () => {
  it('renders the workout plan data correctly', () => {
    render(<GeneratedWorkoutDisplay workoutPlanData={mockWorkoutPlan} />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Custom Test Plan')).toBeInTheDocument();
    expect(screen.getByText(/Muscle Gain/i)).toBeInTheDocument();
    expect(screen.getByText(/Intermediate/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test workout plan/i)).toBeInTheDocument();
    expect(screen.getByText(/4 days per week/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Monday/i)).toBeInTheDocument();
    expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
    expect(screen.getByText(/Tuesday/i)).toBeInTheDocument();
    expect(screen.getByText(/Rest Day/i)).toBeInTheDocument();
  });
  
  it('handles print button click correctly', () => {
    render(<GeneratedWorkoutDisplay workoutPlanData={mockWorkoutPlan} />);
    
    // Click the print button
    const printButton = screen.getByTitle('Print Workout');
    fireEvent.click(printButton);
    
    // Verify window.print was called
    expect(window.print).toHaveBeenCalled();
  });
  
  it('handles copy to clipboard button click correctly', async () => {
    render(<GeneratedWorkoutDisplay workoutPlanData={mockWorkoutPlan} />);
    
    // Click the copy button
    const copyButton = screen.getByTitle('Copy to Clipboard');
    fireEvent.click(copyButton);
    
    // Verify clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Workout plan copied to clipboard!');
  });
  
  it('opens save dialog when save button is clicked', () => {
    const onSaveMock = jest.fn();
    render(<GeneratedWorkoutDisplay workoutPlanData={mockWorkoutPlan} onSave={onSaveMock} />);
    
    // Click the save button
    const saveButton = screen.getByTitle('Save Workout');
    fireEvent.click(saveButton);
    
    // Verify dialog is opened
    expect(screen.getByText('Save Workout Plan')).toBeInTheDocument();
    expect(screen.getByLabelText('Workout Plan Name')).toBeInTheDocument();
    
    // Fill the name and click save
    fireEvent.change(screen.getByLabelText('Workout Plan Name'), { target: { value: 'My Saved Workout' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Verify onSave was called with correct params
    expect(onSaveMock).toHaveBeenCalledWith('My Saved Workout', mockWorkoutPlan.workoutPlan);
  });

  it('shows an error for invalid workout data', () => {
    render(<GeneratedWorkoutDisplay workoutPlanData={{}} />);
    expect(screen.getByText('Invalid workout plan format. Please try again.')).toBeInTheDocument();
  });
});
