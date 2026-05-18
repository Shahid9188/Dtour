import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import TripBuilder from './pages/TripBuilder';
import TripDashboard from './pages/TripDashboard';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Launch from './pages/Launch';
import Navbar from './components/Navbar/Navbar';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--terra)' }}>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--terra)' }}>Loading...</div>;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return children;
};

const AppRoutes = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/';

    return (
        <div className="app-bg">
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Launch />} />
                <Route path="/home" element={<Home />} />

                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

                <Route path="/explore" element={<Explore />} />
                <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/trips/new" element={<ProtectedRoute><TripBuilder /></ProtectedRoute>} />
                <Route path="/trips/:id" element={<ProtectedRoute><TripDashboard /></ProtectedRoute>} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
            <AuthProvider>
                <TripProvider>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                fontFamily: "'DM Sans', sans-serif",
                                background: 'var(--warm-white)',
                                color: 'var(--ink)',
                                border: '1px solid var(--cream-dark)',
                                borderRadius: '12px',
                            },
                        }}
                    />
                </TripProvider>
            </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
