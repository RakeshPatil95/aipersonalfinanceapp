/** @format */
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close the modal when the background is clicked
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent click events inside modal from closing it
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
