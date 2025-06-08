// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { loadModels, generateSummary, generateMCQs, generateFillInTheBlanks, areModelsLoaded} from "../utils/aiUtils"

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 3, model: '' });
  const [generating, setGenerating] = useState({ summary: false, mcq: false, fillblanks: false });
  const [results, setResults] = useState({ summary: '', mcqs: [], fillblanks: '' });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (!areModelsLoaded() && !modelsLoading) {
      handleLoadModels();
    } else if (areModelsLoaded()) {
      setModelsLoaded(true);
    }
  }, []);

  const handleLoadModels = async () => {
    if (modelsLoading || areModelsLoaded()) return;

    setModelsLoading(true);
    try {
      await loadModels((current, total, model) => {
        setLoadingProgress({ current, total, model });
      });
      setModelsLoaded(true);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModelsLoaded(true);
    } finally {
      setModelsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

const waitForUIUpdate = () => new Promise(resolve => requestAnimationFrame(resolve));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleGenerateAll = async () => {
  if (!text.trim()) return;

  setIsGenerating(true);
  setResults({ summary: '', mcqs: [], fillblanks: '' });

  // STEP 1: Summary
  setGenerating({ summary: true, mcq: false, fillblanks: false });
  await waitForUIUpdate();
  await sleep(300); // Small delay for UI
  try {
    const summary = await generateSummary(text);
    setResults(prev => ({ ...prev, summary }));
  } catch (e) {
    console.error("Summary error:", e);
    setResults(prev => ({ ...prev, summary: 'Failed to generate summary' }));
  }

  // STEP 2: MCQs
  setGenerating({ summary: false, mcq: true, fillblanks: false });
  await waitForUIUpdate();
  await sleep(300); // Small delay for UI
  try {
    const mcqs = await generateMCQs(text, 3);
    setResults(prev => ({ ...prev, mcqs }));
  } catch (e) {
    console.error("MCQ error:", e);
    setResults(prev => ({ ...prev, mcqs: [] }));
  }

  // STEP 3: Fill-in-the-Blanks
  setGenerating({ summary: false, mcq: false, fillblanks: true });
  await waitForUIUpdate();
  await sleep(300); // Small delay for UI
  try {
    const fill = await generateFillInTheBlanks(text);
    setResults(prev => ({ ...prev, fillblanks: fill }));
  } catch (e) {
    console.error("Fill error:", e);
    setResults(prev => ({ ...prev, fillblanks: 'Failed to generate fill-in-the-blanks' }));
  }

  // Cleanup
  setGenerating({ summary: false, mcq: false, fillblanks: false });
  await sleep(200); // Let UI show last loader briefly
  setIsGenerating(false);
};



  return (
    <AppContext.Provider value={{
      text,
      setText,
      modelsLoading,
      modelsLoaded,
      isGenerating,
      loadingProgress,
      generating,
      results,
      theme,
      toggleTheme,
      handleFileUpload,
      handleGenerateAll,
    }}>
      {children}
    </AppContext.Provider>
  );
};