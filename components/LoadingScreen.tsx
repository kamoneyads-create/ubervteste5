import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;
