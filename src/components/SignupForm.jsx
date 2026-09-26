import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Mail, UserPlus } from 'lucide-react';

const SignupForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration attempt:', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      // Handle successful registration here
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Redirect to Google OAuth for signup");
    // Add Google OAuth implementation
  };

  const handleLoginRedirect = () => {
    console.log("Redirect to login page");
    // Add navigation to login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 px-4 py-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6 border border-white/20">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Join EEC
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-left">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none ${
                  errors.username 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-left">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-left">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-left">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPass ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none ${
                  errors.confirmPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-yellow-600 hover:text-yellow-800 underline font-medium"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-yellow-600 hover:text-yellow-800 underline font-medium"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-yellow-600 hover:text-yellow-800 font-semibold transition-colors duration-200"
            >
              Sign In
            </button>
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">or continue with</span>
            </div>
          </div>

          {/* Google Sign-up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Sign up with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;