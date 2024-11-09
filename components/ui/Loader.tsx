// components/ui/Loader.tsx
import React from 'react';

const Loader = () => (
    <div className="fixed inset-0 flex items-start justify-center bg-white bg-opacity-70 z-50 pt-10">
        <div className="loader"></div>
        <style jsx>{`
      .loader {
        border: 6px solid rgba(0, 0, 0, 0.1); 
        width: 60px; /* Increased size */
        height: 60px; /* Increased size */
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
    </div>
);

export default Loader;
