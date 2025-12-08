import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('idToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const vectorizeProduct = async (description: string) => {
    // Spring Cloud Function exposes functions at endpoints matching their names
    // For Consumer<String>, it usually accepts the body as the input.
    await client.post('/vectorizeProduct', description, {
        headers: { 'Content-Type': 'text/plain' }
    });
};

export const describeImage = async (imageUrl: string) => {
    // For Function<String, String>, it accepts input and returns output.
    const response = await client.post('/describeImage', imageUrl, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
};
