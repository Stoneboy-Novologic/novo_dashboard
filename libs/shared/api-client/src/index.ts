/**
 * Shared API Client Library
 * 
 * This library provides a typed API client for making HTTP requests
 * to the backend API with authentication and error handling.
 * 
 * @module @construction-mgmt/shared/api-client
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@construction-mgmt/shared/config';
import { ApiResponse } from '@construction-mgmt/shared/types';

/**
 * API Client Class
 * Handles all HTTP requests to the backend API
 */
export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    console.log('[ApiClient] Initializing API client with base URL:', baseURL);
    
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - adds authentication token
    this.client.interceptors.request.use(
      (config) => {
        console.log('[ApiClient] Making request:', config.method?.toUpperCase(), config.url);
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
          console.log('[ApiClient] Added authentication token to request');
        }
        return config;
      },
      (error) => {
        console.error('[ApiClient] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handles errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        console.log('[ApiClient] Received response:', response.status, response.config.url);
        return response;
      },
      async (error: AxiosError) => {
        console.error('[ApiClient] Response error:', error.response?.status, error.config?.url);
        
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
          console.log('[ApiClient] Unauthorized - clearing token');
          this.clearToken();
          // Redirect to login or refresh token
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   * @param token - JWT token
   */
  setToken(token: string): void {
    console.log('[ApiClient] Setting authentication token');
    this.token = token;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Get authentication token
   * @returns JWT token or null
   */
  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    console.log('[ApiClient] Clearing authentication token');
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Generic GET request
   * @param url - Endpoint URL
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    console.log('[ApiClient] GET request to:', url);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Request failed');
    } catch (error) {
      console.error('[ApiClient] GET error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log('[ApiClient] POST request to:', url, 'with data:', data);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Request failed');
    } catch (error) {
      console.error('[ApiClient] POST error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log('[ApiClient] PUT request to:', url, 'with data:', data);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Request failed');
    } catch (error) {
      console.error('[ApiClient] PUT error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log('[ApiClient] PATCH request to:', url, 'with data:', data);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Request failed');
    } catch (error) {
      console.error('[ApiClient] PATCH error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   * @param url - Endpoint URL
   * @param config - Axios request config
   * @returns Promise with response data
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    console.log('[ApiClient] DELETE request to:', url);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Request failed');
    } catch (error) {
      console.error('[ApiClient] DELETE error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload file
   * @param url - Endpoint URL
   * @param file - File to upload
   * @param onProgress - Progress callback
   * @returns Promise with response data
   */
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    console.log('[ApiClient] Uploading file to:', url, 'file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Upload failed');
    } catch (error) {
      console.error('[ApiClient] Upload error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format errors
   * @param error - Axios error
   * @returns Formatted error
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || error.message;
      console.error('[ApiClient] Server error:', error.response.status, message);
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      console.error('[ApiClient] No response received:', error.request);
      return new Error('Network error: No response from server');
    } else {
      // Error setting up request
      console.error('[ApiClient] Request setup error:', error.message);
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Initialize token from localStorage if available
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token');
  if (storedToken) {
    apiClient.setToken(storedToken);
  }
}
