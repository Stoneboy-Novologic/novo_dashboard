/**
 * Shared Utilities Library
 * 
 * This library contains shared utility functions
 * used across both frontend and backend applications.
 * 
 * @module @construction-mgmt/shared/utils
 */

/**
 * Formats a date to a readable string
 * @param date - Date object or string to format
 * @param format - Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  console.log('[formatDate] Formatting date:', date, 'with format:', format);
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Calculates the variance between two numbers
 * @param actual - Actual value
 * @param budgeted - Budgeted value
 * @returns Variance percentage
 */
export function calculateVariance(actual: number, budgeted: number): number {
  console.log('[calculateVariance] Calculating variance:', { actual, budgeted });
  if (budgeted === 0) return 0;
  return ((actual - budgeted) / budgeted) * 100;
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  console.log('[isValidEmail] Validating email:', email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  console.log('[generateId] Generating unique ID');
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats file size to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  console.log('[formatFileSize] Formatting file size:', bytes);
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  console.log('[debounce] Creating debounced function');
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  console.log('[deepClone] Cloning object');
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if value is empty
 */
export function isEmpty(value: any): boolean {
  console.log('[isEmpty] Checking if value is empty:', value);
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
