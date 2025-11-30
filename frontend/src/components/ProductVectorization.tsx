import React, { useState } from 'react';
import { vectorizeProduct } from '../api/client';

export const ProductVectorization: React.FC = () => {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await vectorizeProduct(description);
            setStatus('success');
            setDescription('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Product Description Vectorization</h2>
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
                <button
                    type="submit"
                    disabled={status === 'loading'}
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
