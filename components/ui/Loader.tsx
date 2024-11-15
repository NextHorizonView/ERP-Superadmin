import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 6px solid rgba(0, 0, 0, 0.1);
        width: 60px; /* Spinner size */
        height: 60px;
        border-radius: 50%;
        border-top-color: #1a237e; /* Customize spinner color */
        animation: spin 1s linear infinite; /* Faster spin for smoother feel */
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
