import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Check for existing session (simplified for now, ideally check tokens)
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('idToken');
        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (username: string, token: string) => {
        setUser(username);
        setToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('user', username);
        localStorage.setItem('idToken', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('idToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
