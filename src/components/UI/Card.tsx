import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="border-b border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};