// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};
