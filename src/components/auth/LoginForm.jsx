import React, { useState , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import './LoginForm.css';
import { AuthContext } from '../../context/AuthContext';




const LoginForm = ({ onNavigateToRegister, onForgotPassword, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(AuthContext);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
    const navigate = useNavigate();
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Show alert message
    const showAlert = (message, type = 'error') => {
        setAlert({ show: true, message, type });

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                setAlert({ show: false, message: '', type: 'error' });
            }, 5000);
        }
    };

    // Hide alert
    const hideAlert = () => {
        setAlert({ show: false, message: '', type: 'error' });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Get CSRF token
    const getCSRFToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    };

    // Handle form submission
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - store tokens
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                showAlert('Login successful! Redirecting...', 'success');
                setUser({ username: formData.username, profileImage: '/images/person.png' });

                // Call success callback or redirect
                setTimeout(() => {  
                    navigate("/"); // ✅ burda birbaşa yönləndir
                }, 1500);
            } else {
                // Handle different error cases
                if (response.status === 401) {
                    showAlert('Invalid Username or password. Please try again.');
                } else if (data.detail) {
                    showAlert(data.detail);
                } else if (data.non_field_errors) {
                    showAlert(data.non_field_errors[0]);
                } else {
                    showAlert('Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Connection error. Please check your internet connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>


            <div className="login-container">
                {/* Background decoration */}
                <div className="background-decoration">
                    <div className="bg-blur bg-blur-1"></div>
                    <div className="bg-blur bg-blur-2"></div>
                </div>

                <div className="login-wrapper">
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo-container">
                            <Shield className="logo-icon" />
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>

                    {/* Form Container */}
                    <div className="login-form-container">
                        <div className="login-form">
                            {/* Alert */}
                            {alert.show && (
                                <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                                    {alert.type === 'success' ? (
                                        <CheckCircle className="alert-icon" />
                                    ) : (
                                        <AlertCircle className="alert-icon" />
                                    )}
                                    {alert.message}
                                </div>
                            )}

                            {/* Username Field */}
                            <div className="form-group">
                                <label htmlFor="text" className="form-label">
                                    Username
                                </label>
                                <div className="input-container">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`form-input ${errors.username ? 'error' : ''}`}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                {errors.username && (
                                    <div className="error-text">{errors.username}</div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-container">
                                    <Lock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-input password-input ${errors.password ? 'error' : ''}`}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle"
                                    >
                                        {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="error-text">{errors.password}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="submit-button"
                            >
                                {isLoading ? (
                                    <div className="loading-content">
                                        <div className="spinner"></div>
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            {/* Forgot Password Link */}
                            <div className="forgot-password">
                                <button
                                    type="button"
                                    onClick={onForgotPassword}
                                    className="forgot-link"
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    Forgot your password?
                                </button>
                            </div>

                            {/* Register Link */}
                            <div className="register-link">
                                <p className="register-text">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={onNavigateToRegister}
                                        className="link-button"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="login-footer">
                        © 2025 PetLove. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
};

// Example usage component
const LoginPage = () => {
    const navigate = useNavigate();
    const handleNavigateToRegister = () => {
        // Handle navigation to register page
        console.log('Navigate to register page');
        // Example: navigate('/register') if using React Router
        navigate('/register');
    };

    const handleForgotPassword = () => {
        // Handle forgot password action
        console.log('Navigate to forgot password page');
        // Example: navigate('/forgot-password') if using React Router
    };

    const handleLoginSuccess = (userData) => {
        // Handle successful login
        console.log('Login successful:', userData);
        // Example: navigate('/dashboard') if using React Router
    };

    return (
        <LoginForm
            onNavigateToRegister={handleNavigateToRegister}
            onForgotPassword={handleForgotPassword}
            onLoginSuccess={handleLoginSuccess}
        />
    );
};

export default LoginPage;