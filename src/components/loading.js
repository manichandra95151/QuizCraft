import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingProgress({ current, total, model }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading AI Models
          </h3>
          <p className="text-gray-600 mb-4">
            Currently loading: {model}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {current} of {total} models loaded ({percentage}%)
          </p>
        </div>
      </div>
    </div>
  );
}