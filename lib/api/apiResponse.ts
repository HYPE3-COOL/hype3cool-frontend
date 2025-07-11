export interface ApiResponse<T> {
    data: T | T[]; // Can be an object or an array
    status: 'success' | 'error';
    message?: string; // Optional message for errors
}