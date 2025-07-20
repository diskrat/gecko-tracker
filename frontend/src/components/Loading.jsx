import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 ${sizeClasses[size]} ${className}`}></div>
    );
};

export const LoadingCard = ({ message = 'Carregando dados...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600 text-lg">{message}</p>
            <div className="flex space-x-1 mt-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );
};

export const ErrorCard = ({ error, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Ops! Algo deu errado</h3>
                <p className="text-red-700 mb-4">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        🔄 Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoadingCard;
