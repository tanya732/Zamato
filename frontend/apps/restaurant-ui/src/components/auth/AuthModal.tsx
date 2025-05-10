import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };
  
  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-0 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Restaurant Login' : 'Register Restaurant'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6">
                {mode === 'login' ? (
                  <LoginForm onSuccess={onClose} />
                ) : (
                  <SignupForm onSuccess={onClose} />
                )}
                
                {/* Toggle between login/signup */}
                <div className="mt-4 text-center">
                  {mode === 'login' ? (
                    <p className="text-gray-600">
                      Don't have a restaurant account?{' '}
                      <button
                        className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                        onClick={() => setMode('signup')}
                      >
                        Register now
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Already registered?{' '}
                      <button
                        className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                        onClick={() => setMode('login')}
                      >
                        Log in
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;