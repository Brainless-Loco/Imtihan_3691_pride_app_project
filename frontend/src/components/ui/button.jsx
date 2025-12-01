// src/components/ui/button.jsx
import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  className = "",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-2xl font-semibold transition duration-200 shadow-sm";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
