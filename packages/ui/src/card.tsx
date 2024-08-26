import React from "react";

export function Card({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={`max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <div className="text-gray-600 leading-relaxed space-y-3">
          {children}
        </div>
      </div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
        <div className="w-full h-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full"></div>
      </div>
    </div>
  );
}