import { Brain, ToggleLeft, ToggleRight } from 'lucide-react';
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Header = () => {
     const {
        toggleTheme,
        theme,
      } = useContext(AppContext);
  return (
    <div className={`backdrop-blur-sm border-b sticky top-0 z-40 transition-colors duration-300 ${
            theme === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-800/90 border-gray-700'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      QuizCraft
                    </h1>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Get Summaries, Mcq's & Fill in the blanks
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {theme === 'light' ? (
                      <ToggleRight 
                        className={`cursor-pointer w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} 
                        onClick={toggleTheme} 
                      />
                    ) : (
                      <ToggleLeft 
                        className={`cursor-pointer w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} 
                        onClick={toggleTheme} 
                      />
                    )}
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {theme === 'light' ? 'Light' : 'Dark'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
};

export default Header;