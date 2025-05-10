import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, loading, error } = useAuthStore();
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login({ email, password });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  // Input animations
  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };
  
  // Button animations
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } },
    disabled: { opacity: 0.7, transition: { duration: 0.2 } }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Restaurant Email
        </label>
        <motion.div
          variants={inputVariants}
          whileFocus="focus"
          whileTap="focus"
          initial="blur"
          animate="blur"
        >
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
          />
        </motion.div>
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>
      
      {/* Password input */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <motion.div
          variants={inputVariants}
          whileFocus="focus"
          whileTap="focus"
          initial="blur"
          animate="blur"
        >
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`input ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
          />
        </motion.div>
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
        )}
      </div>
      
      {/* Error message from auth store */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Submit button */}
      <motion.button
        type="submit"
        className="btn btn-primary w-full py-3"
        disabled={loading}
        variants={buttonVariants}
        whileHover={loading ? "disabled" : "hover"}
        whileTap={loading ? "disabled" : "tap"}
        initial="blur"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Logging in...
          </span>
        ) : (
          'Log in'
        )}
      </motion.button>
      
      {/* Demo account notice */}
      <p className="text-xs text-gray-500 text-center mt-4">
        For demo: Use any email and password
      </p>
    </form>
  );
};

export default LoginForm;