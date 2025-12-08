import React, { useState } from 'react';
import { InitiateAuthCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, COGNITO_CONFIG } from '../auth/cognito';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const command = new InitiateAuthCommand({
                AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                ClientId: COGNITO_CONFIG.clientId,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                },
            });

            const response = await cognitoClient.send(command);

            if (response.AuthenticationResult && response.AuthenticationResult.IdToken) {
                login(username, response.AuthenticationResult.IdToken);
                navigate('/');
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログインページ</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">パスワード</label>
                        <input
                            type="password"
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};
