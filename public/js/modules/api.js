import { state } from './state.js';

const API_URL = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
        headers['x-auth-token'] = state.token;
    }
    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'An error occurred');
    }
    return response.json();
};