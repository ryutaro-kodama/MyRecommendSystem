import React, { useState } from 'react';
import { useOpenAIKey } from '../context/OpenAIKeyContext';

export const ApiKeyInput: React.FC = () => {
    const { apiKey, setApiKey, clearApiKey } = useOpenAIKey();
    const [inputKey, setInputKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim()) {
            setApiKey(inputKey.trim());
            setInputKey('');
        }
    };

    if (apiKey) {
        return (
            <div className="p-4 border rounded shadow-md bg-white mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-semibold text-green-600">OpenAI API Key is set</span>
                        <span className="text-gray-500 text-sm ml-2">(...{apiKey.slice(-4)})</span>
                    </div>
                    <button
                        onClick={clearApiKey}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                        Clear Key
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded shadow-md bg-white mb-4">
            <h2 className="text-lg font-bold mb-2">Setup OpenAI API Key</h2>
            <p className="text-sm text-gray-600 mb-4">
                Enter your OpenAI API Key to enable vectorization and image description features.
                The key is stored locally in your browser.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 p-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Save Key
                </button>
            </form>
        </div>
    );
};
