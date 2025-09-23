import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Check, X, Heart } from 'lucide-react';
import './RegisterForm.css';
import { useNavigate } from 'react-router-dom';

const COUNTRY_PHONE_CODES = [
  { code: '+1', flag: 'US' },
  { code: '+44',flag: 'GB' },
  { code: '+49',flag: 'DE' },
  { code: '+33',flag: 'FR' },
  { code: '+39',flag: 'IT' },
  { code: '+34',flag: 'ES' },
  { code: '+7',flag: 'RU' },
  { code: '+86',flag: 'CN' },
  { code: '+81',flag: 'JP' },
  { code: '+91',flag: 'IN' },
  { code: '+994',flag: 'AZ' },
  { code: '+90',flag: 'TR' },
];

const RegisterForm = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState('+994');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    // Validate form
    if (!validateForm()) return;

    hideAlert();
    setIsLoading(true);

    try {
      const registrationData = {
        ...formData,
        phone: formData.phone ? `${selectedCountryCode}${formData.phone}` : ''
      };
      delete registrationData.confirmPassword;

      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Registration successful! Please check your email to verify your account.', 'success');
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          first_name: '',
          last_name: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });

        // Call success callback or redirect to login
        if (onRegisterSuccess) {
          setTimeout(() => onRegisterSuccess(data), 1500);
        } else {
          setTimeout(() => {
            window.location.href = '/login/';
          }, 1500);
        }
      } else {
        // Handle different error cases
        if (data.email && data.email[0]) {
          showAlert(data.email[0]);
        } else if (data.username && data.username[0]) {
          showAlert(data.username[0]);
        } else if (data.detail) {
          showAlert(data.detail);
        } else if (data.non_field_errors) {
          showAlert(data.non_field_errors[0]);
        } else {
          showAlert('Registration failed. Please try again.');
        }
        setErrors(data);
      }
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('Connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
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

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return '#ef4444';
    if (strength <= 3) return '#eab308';
    return '#22c55e';
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="register-container">
      <div className="background-decoration">
        <div className="bg-blur bg-blur-1"></div>
        <div className="bg-blur bg-blur-2"></div>
      </div>

      <div className="register-wrapper">
        {/* Header */}
        <div className="register-header">
          <div className="logo-container">
            <Heart className="logo-icon" />
          </div>
          <h1 className="register-title">Join PetLove</h1>
          <p className="register-subtitle">Find your perfect furry companion</p>
        </div>

        {/* Registration Form */}
        <div className="register-form-container">
          <div className="register-form">
            {/* Alert */}
            {alert.show && (
              <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {alert.type === 'success' ? (
                  <Check className="alert-icon" />
                ) : (
                  <X className="alert-icon" />
                )}
                {alert.message}
              </div>
            )}

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && <p className="error-text">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* First Name and Last Name */}
            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  placeholder="First name"
                />
                {errors.first_name && <p className="error-text small">{errors.first_name}</p>}
              </div>

              <div className="form-group half">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  placeholder="Last name"
                />
                {errors.last_name && <p className="error-text small">{errors.last_name}</p>}
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div className="phone-container">
                <div className="country-selector">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="country-button"
                  >
                    <span className="country-flag">
                      {COUNTRY_PHONE_CODES.find(c => c.code === selectedCountryCode)?.flag}
                    </span>
                    <span className="country-code">{selectedCountryCode}</span>
                  </button>

                  {showCountryDropdown && (
                    <div className="country-dropdown">
                      {COUNTRY_PHONE_CODES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountryCode(country.code);
                            setShowCountryDropdown(false);
                          }}
                          className="country-option"
                        >
                          <span className="country-flag">{country.flag}</span>
                          <span className="country-code">{country.code}</span>
                          <span className="country-name">{country.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="phone-input-container">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input phone-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input password-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-info">
                    <span className="strength-label">Password strength:</span>
                    <span
                      className="strength-text"
                      style={{ color: getStrengthColor() }}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(getPasswordStrength() / 5) * 100}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input password-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="password-match">
                  {formData.password === formData.confirmPassword ? (
                    <div className="match-success">
                      <Check className="match-icon" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="match-error">
                      <X className="match-icon" />
                      <span>Passwords don't match</span>
                    </div>
                  )}
                </div>
              )}

              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              <p className="login-text">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="link-button"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="register-footer">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component - RegisterPage wrapper
const RegisterPage = () => {
  const navigate = useNavigate();
  const handleNavigateToLogin = () => {
    // Handle navigation to login page
    // Example: navigate('/login') if using React Router
    navigate('/login');
  };

  const handleRegisterSuccess = (userData) => {
    // Handle successful registration
    console.log('Registration successful:', userData);
    // Example: navigate('/login') or navigate('/dashboard') if using React Router
  };

  return (
    <RegisterForm
      onNavigateToLogin={handleNavigateToLogin}
      onRegisterSuccess={handleRegisterSuccess}
    />
  );
};

export default RegisterPage;