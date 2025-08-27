import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 
        className={`animate-spin text-primary-600 ${sizeClasses[size]}`}
      />
      {text && (
        <p className={`text-secondary-600 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
