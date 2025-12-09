import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductVectorization } from './components/ProductVectorization';
import { ImageDescription } from './components/ImageDescription';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { OpenAIKeyProvider } from './context/OpenAIKeyContext';
import { ApiKeyInput } from './components/ApiKeyInput';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ... (imports)

const MainLayout: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Recommendation System Admin</h1>
        <div className="user-info">
          <span>Welcome</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="app-main">
        <ApiKeyInput />
        <div className="component-wrapper">
          <ImageDescription />
        </div>
        <div className="component-wrapper">
          <ProductVectorization />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <OpenAIKeyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </OpenAIKeyProvider>
    </AuthProvider>
  );
}

export default App;
