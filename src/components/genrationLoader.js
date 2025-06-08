import React from 'react';
import { Loader2, FileText, HelpCircle, Edit } from 'lucide-react';

const GenerationLoader = ({ generating, theme = 'light' }) => {

  if (!generating || typeof generating !== 'object') {
    return null;
  }

  const getGenerationStage = () => {
    
    if (generating.summary === true) {
      return {
        icon: FileText,
        title: 'Generating Summary',
        description: 'Creating a comprehensive summary of your content...',
        stage: 1,
        total: 3
      };
    }
    if (generating.mcq === true) {
      return {
        icon: HelpCircle,
        title: 'Generating MCQs',
        description: 'Creating multiple choice questions to test understanding...',
        stage: 2,
        total: 3
      };
    }
    if (generating.fillblanks === true) {
      return {
        icon: Edit,
        title: 'Generating Fill-in-the-Blanks',
        description: 'Creating fill-in-the-blank exercises for active learning...',
        stage: 3,
        total: 3
      };
    }
    
    // If isGenerating is true but no specific stage is active, show a general loading
    return {
      icon: Loader2,
      title: 'Preparing Generation',
      description: 'Setting up AI models for content generation...',
      stage: 1,
      total: 3
    };
  };

  const currentStage = getGenerationStage();
  
  if (!currentStage) {
    return null;
  }

  const Icon = currentStage.icon;
  const progressPercentage = (currentStage.stage / currentStage.total) * 100;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl opacity-20"></div>
        
        {/* Progress bar */}
        <div className={`w-full h-2 rounded-full mb-6 ${
          theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Main content */}
        <div className="text-center">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon className="w-10 h-10 text-white" />
            </div>
            
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-3 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {currentStage.title}
          </h3>

          {/* Description */}
          <p className={`text-base mb-6 leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {currentStage.description}
          </p>

          {/* Stage indicator */}
          <div className="flex items-center justify-center space-x-2">
            <span className={`text-sm font-medium ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Step {currentStage.stage} of {currentStage.total}
            </span>
            
            {/* Dots indicator */}
            <div className="flex space-x-1 ml-3">
              {Array.from({ length: currentStage.total }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < currentStage.stage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : theme === 'light'
                      ? 'bg-gray-300'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Animated pulse effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse"></div>
      </div>
    </div>
  );
};

export default GenerationLoader;
