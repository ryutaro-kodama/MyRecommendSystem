import React, { useState } from 'react';
import { describeImage } from '../api/openai';
import { useOpenAIKey } from '../context/OpenAIKeyContext';

export const ImageDescription: React.FC<{
    onDescriptionGenerated?: (imageUrl: string, description: string) => void;
}> = ({ onDescriptionGenerated }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const { apiKey } = useOpenAIKey();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey) {
            alert('Please set your OpenAI API Key first.');
            return;
        }

        setStatus('loading');
        setResult(null);
        try {
            const description = await describeImage(imageUrl, apiKey);
            setResult(description);
            setStatus('success');
            if (onDescriptionGenerated) {
                onDescriptionGenerated(imageUrl, description);
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Product Image Description</h2>
            {!apiKey && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                    ⚠️ API Key is missing. Please enter it above.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="url"
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading' || !apiKey}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Generating...' : 'Generate Description'}
                </button>
                {status === 'error' && <p className="text-red-600">Error generating description.</p>}
                {result && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold mb-2">Generated Description:</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
                    </div>
                )}
            </form>
        </div>
    );
};
