import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { listVectors } from '../api/client';

interface VectorData {
    key: string;
    originalText: string;
    imageUrl: string;
    vector: number[];
}

export const VectorList: React.FC = () => {
    const [vectors, setVectors] = useState<VectorData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchVectors = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listVectors();
            // Ensure data is typed correctly or cast if necessary, but listVectors returns any currently.
            // Ideally we should update client.ts types too, but for now we rely on runtime response.

            data.forEach((v: VectorData) => {
                v.imageUrl = v.imageUrl.substring(1, v.imageUrl.length - 1);
                // originalText is expected to be a JSON string. We will parse it in the render or here. 
                // However, the interface defines it as string. Let's keep it as string in the data object 
                // but parse it when rendering or extend the interface locally.
                v.originalText = v.originalText.replaceAll("\\\"", "\"").replaceAll("\'", "\"");
                v.originalText = v.originalText.substring(1, v.originalText.length - 1);
            });

            setVectors(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVectors();
    }, [token]);

    const parseOriginalText = (text: string) => {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse originalText", e);
            return { color: '', quantity: '', genre: '', description: text };
        }
    };

    return (
        <div className="component-container">
            <div className="header-row">
                <h2>Saved Vectors</h2>
                <button onClick={fetchVectors} disabled={loading} className="btn-primary">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="vector-list-container">
                {vectors.length === 0 && !loading && <p>No vectors found.</p>}
                {vectors.length > 0 && (
                    <table className="vector-table">
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Genre</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Vector (first 5 dims)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vectors.map((v, i) => {
                                const parsed = parseOriginalText(v.originalText);
                                return (
                                    <tr key={i} data-key={v.key}>
                                        <td>{parsed.color}</td>
                                        <td>{parsed.quantity}</td>
                                        <td>{parsed.genre}</td>
                                        <td>{parsed.description}</td>
                                        <td>
                                            {v.imageUrl && (
                                                <img
                                                    src={v.imageUrl}
                                                    alt="Product"
                                                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </td>
                                        <td>[{v.vector.slice(0, 5).join(', ')}...]</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            <style>{`
                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .vector-list-container {
                    max-height: 500px;
                    overflow-y: auto;
                }
                .vector-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                }
                .vector-table th, .vector-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    vertical-align: top;
                }
                .vector-table th {
                    background-color: #f2f2f2;
                    position: sticky;
                    top: 0;
                }
                .vector-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .vector-table tr:hover {
                    background-color: #f1f1f1;
                }
            `}</style>
        </div>
    );
};
