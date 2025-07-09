import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur</h3>
      <p className="text-red-700 text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Réessayer</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;