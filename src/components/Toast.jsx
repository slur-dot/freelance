import { useEffect } from "react";

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-5 right-5 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 flex items-start gap-3 max-w-sm animate-slide-in">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Added to Cart</h4>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-900 text-lg font-bold w-5 h-5 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
