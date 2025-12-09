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

export const vectorizeProduct = async (text: string, vector: number[], imageUrl: string) => {
    // Send text, vector, and imageUrl to the backend
    await client.post('/vectorizeProduct', {
        text,
        vector,
        imageUrl
    });
};

export const listVectors = async () => {
    const response = await client.get('/listVectors');
    return response.data;
};

/* describeImage is now handled directly by frontend via OpenAI API
export const describeImage = async (imageUrl: string) => {
    ...
};
*/
