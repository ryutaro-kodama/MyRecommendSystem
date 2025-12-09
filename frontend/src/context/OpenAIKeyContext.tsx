import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface OpenAIKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string) => void;
    clearApiKey: () => void;
}

const OpenAIKeyContext = createContext<OpenAIKeyContextType | undefined>(undefined);

export const OpenAIKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState<string | null>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
            setApiKeyState(storedKey);
        }
    }, []);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        localStorage.setItem('openai_api_key', key);
    };

    const clearApiKey = () => {
        setApiKeyState(null);
        localStorage.removeItem('openai_api_key');
    };

    return (
        <OpenAIKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
            {children}
        </OpenAIKeyContext.Provider>
    );
};

export const useOpenAIKey = (): OpenAIKeyContextType => {
    const context = useContext(OpenAIKeyContext);
    if (!context) {
        throw new Error('useOpenAIKey must be used within an OpenAIKeyProvider');
    }
    return context;
};
