import React, { useState } from 'react';
import { vectorizeProduct } from '../api/client';
import { getEmbedding } from '../api/openai';
import { useOpenAIKey } from '../context/OpenAIKeyContext';

export const ProductVectorization: React.FC = () => {
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const { apiKey } = useOpenAIKey();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey) {
            alert('Please set your OpenAI API Key first.');
            return;
        }

        setStatus('loading');
        try {
            // 1. Get Embedding from OpenAI (Frontend)
            const embedding = await getEmbedding(description, apiKey);

            // 2. Send text, vector, and image URL to Backend
            await vectorizeProduct(description, embedding, imageUrl);

            setStatus('success');
            setDescription('');
            setImageUrl('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Product Description Vectorization</h2>
            {!apiKey && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                    ⚠️ API Key is missing. Please enter it above.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="url"
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/product.jpg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading' || !apiKey}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Processing...' : 'Vectorize & Save'}
                </button>
                {status === 'success' && <p className="text-green-600">Successfully saved vector!</p>}
                {status === 'error' && <p className="text-red-600">Error saving vector.</p>}
            </form>
        </div>
    );
};
