// src/components/InputSection.jsx

import { Sparkles, Upload, Loader2} from 'lucide-react';
import DownloadButton from './downloadContent';
import React, { useRef,useContext } from 'react';
import { AppContext } from '../context/AppContext';

const InputSection = () => {
  const {
    text,
    setText,
    handleFileUpload,
    handleGenerateAll,
    isGenerating,
    theme,
    results,
  } = useContext(AppContext);
  const fileInputRef=useRef(null);
  return (
    <div className="space-y-6">
            <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Input Text
                </h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'light' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here or upload a .txt file. The AI will analyze it and generate study materials including summaries, multiple choice questions, and fill-in-the-blank exercises..."
                className={`w-full h-80 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transparent-scrollbar ${
                  theme === 'light' 
                    ? 'bg-white border-gray-300 text-gray-900' 
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                }`}
              />

              <div className="flex items-center justify-between mt-6">
                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {text.length} characters • {text.split(' ').filter(w => w.trim()).length} words
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleGenerateAll}
                    disabled={!text.trim() || isGenerating}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>

                  <DownloadButton text={text} results={results} />
                </div>
              </div>
            </div>
          </div>
  );
};

export default InputSection;