import React, { useContext } from 'react';
import { LoadingProgress } from './components/loading';
import GenerationLoader from './components/genrationLoader';
import Header from './components/Header';
import InputSection from "./components/InputSection";
import ResultsSection from './components/ResultsSection';
import { AppContext } from './context/AppContext';

function App() {
  const {
    modelsLoading,
    loadingProgress,
    isGenerating,
    generating,
    theme,
  } = useContext(AppContext);

   console.log("isGenerating:", isGenerating);
  console.log("generating state:", generating);

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-y-hidden ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Model Loading Modal */}
      {modelsLoading && (
        <LoadingProgress 
          current={loadingProgress.current} 
          total={loadingProgress.total} 
          model={loadingProgress.model} 
        />
      )}

      {/* Generation Loading Modal */}
      {isGenerating && (
        <GenerationLoader  generating={generating} theme={theme}
        />
      )}

      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <InputSection />

          {/* Results Section */}
          <ResultsSection />
        </div>
      </div>
    </div>
  );
}

export default App;