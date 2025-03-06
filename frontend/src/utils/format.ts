/**
 * Data formatting utilities
 */
import { format, parseISO } from 'date-fns';

/**
 * Format date string to display format
 * @param dateInput ISO date string or Date object
 * @param formatStr Format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateInput: string | Date, formatStr = 'MMM d, yyyy'): string => {
  if (!dateInput) return '';
  try {
    const date = dateInput instanceof Date ? dateInput : parseISO(dateInput);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateInput);
  }
};

/**
 * Format date and time string
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM d, yyyy h:mm a')
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string, formatStr = 'MMM d, yyyy h:mm a'): string => {
  return formatDate(dateString, formatStr);
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