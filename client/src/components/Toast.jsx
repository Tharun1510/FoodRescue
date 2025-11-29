import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  // Auto-hide the toast after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-[9999] animate-bounce-in">
      <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-center gap-4 pr-8 min-w-[300px] transform transition-all duration-500 hover:scale-105 cursor-pointer">
        
        {/* Icon */}
        <div className="bg-green-100 p-2 rounded-full">
          <span className="text-xl">🍩</span>
        </div>

        {/* Text Content */}
        <div>
          <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Fresh Food Alert!</h4>
          <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold text-xl leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;