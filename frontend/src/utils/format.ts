/**
 * Data formatting utilities
 */
import { format, parseISO } from 'date-fns';

/**
 * Format a date string or Date object into a human-readable format
 * @param dateInput - ISO date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof dateInput === 'string' ? dateInput : dateInput.toString();
  }
};

/**
 * Format date and time string or Date object
 * @param dateInput ISO date string or Date object
 * @param formatStr Format string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateInput: string | Date): string => {
  // Use our base formatDate function with a default format
  return formatDate(dateInput);
};

/**
 * Format number with commas and specified decimal places
 * @param value Number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (value?: number, decimals = 2): string => {
  if (value === undefined || value === null) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format weight value with unit
 * @param value Weight value
 * @param unit Unit (default: 'kg')
 * @returns Formatted weight string
 */
export const formatWeight = (value?: number, unit = 'kg'): string => {
  if (value === undefined || value === null) return '';
  return `${formatNumber(value, 1)} ${unit}`;
};

/**
 * Format duration in minutes to hours and minutes
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
};

/**
 * Format number as percentage
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};