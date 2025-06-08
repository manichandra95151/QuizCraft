import React, { useState } from 'react';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function Card({ title, icon, content, type, isLoading, theme = 'light' }) {
  const cardClasses = `rounded-2xl shadow-xl border p-6 transition-colors duration-300  ${
    theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
  }`;
  
  const titleClasses = `text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`;
  const textClasses = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className={cardClasses}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
          {icon}
        </div>
        <h3 className={titleClasses}>{title}</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Generating {title.toLowerCase()}...
          </span>
        </div>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto transparent-scrollbar">
          {type === 'summary' && content && (
            <div className="prose max-w-none">
              <p className={`${textClasses} leading-relaxed`}>{content}</p>
            </div>
          )}

          {type === 'mcq' && content && content.length > 0 && (
            <MCQComponent mcqs={content} theme={theme} />
          )}

          {type === 'fillblanks' && content && (
            <FillInTheBlanksComponent content={content} theme={theme} />
          )}

          {!content && !isLoading && (
            <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} italic`}>
              No content generated yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MCQComponent({ mcqs, theme }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleShowResult = (questionIndex) => {
    setShowResults(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const borderClasses = theme === 'light' ? 'border-gray-200' : 'border-gray-600';
  const bgClasses = theme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const textClasses = theme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <div className="space-y-6">
      {mcqs.map((mcq, questionIndex) => (
        <div key={questionIndex} className={`border rounded-lg p-4 ${borderClasses} ${bgClasses}`}>
          <h4 className={`font-semibold mb-3 ${textClasses}`}>
            {questionIndex + 1}. {mcq.question}
          </h4>
          
          <div className="space-y-2 mb-4">
            {mcq.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[questionIndex] === optionIndex;
              const isCorrect = optionIndex === mcq.correct;
              const showingResults = showResults[questionIndex];
              
              let buttonStyle = "w-full text-left p-3 rounded-lg border transition-all duration-200 ";
              
              if (showingResults) {
                if (isCorrect) {
                  buttonStyle += "bg-green-100 border-green-300 text-green-800";
                } else if (isSelected && !isCorrect) {
                  buttonStyle += "bg-red-100 border-red-300 text-red-800";
                } else {
                  buttonStyle += theme === 'light' 
                    ? "bg-white border-gray-200 text-gray-600" 
                    : "bg-gray-600 border-gray-500 text-gray-300";
                }
              } else {
                if (isSelected) {
                  buttonStyle += "bg-blue-100 border-blue-300 text-blue-800";
                } else {
                  buttonStyle += theme === 'light'
                    ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500";
                }
              }

              return (
                <button
                  key={optionIndex}
                  onClick={() => !showingResults && handleAnswerSelect(questionIndex, optionIndex)}
                  className={buttonStyle}
                  disabled={showingResults}
                >
                  <div className="flex items-center justify-between">
                    <span>{String.fromCharCode(65 + optionIndex)}. {option}</span>
                    {showingResults && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswers[questionIndex] !== undefined && !showResults[questionIndex] && (
            <button
              onClick={() => handleShowResult(questionIndex)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Show Answer</span>
            </button>
          )}

          {showResults[questionIndex] && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Correct Answer:</strong> {String.fromCharCode(65 + mcq.correct)}. {mcq.options[mcq.correct]}
              </p>
              {selectedAnswers[questionIndex] === mcq.correct ? (
                <p className="text-green-600 font-medium mt-1">✓ Correct!</p>
              ) : (
                <p className="text-red-600 font-medium mt-1">✗ Incorrect</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FillInTheBlanksComponent({ content, theme }) {
  const [showAnswers, setShowAnswers] = useState({});
  
  // Parse the content to extract sentences with blanks and their answers
  const parseContentWithAnswers = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.includes('_____')) {
        // This is a sentence with a blank
        const words = trimmed.split(' ');
        const blankIndex = words.findIndex(word => word === '_____');
        
        // Generate plausible answers based on context
        const contextWords = words.filter(w => w.length > 4 && !['this', 'that', 'with', 'from'].includes(w.toLowerCase()));
        const possibleAnswers = [
          'important', 'significant', 'essential', 'crucial', 'vital', 'necessary',
          'effective', 'powerful', 'strong', 'advanced', 'modern', 'innovative',
          'comprehensive', 'detailed', 'thorough', 'complete', 'accurate', 'precise'
        ];
        
        // Try to pick a contextually appropriate answer
        let answer = 'important';
        if (contextWords.length > 0) {
          const randomContext = contextWords[Math.floor(Math.random() * contextWords.length)].toLowerCase();
          if (randomContext.includes('tech') || randomContext.includes('computer') || randomContext.includes('digital')) {
            answer = 'advanced';
          } else if (randomContext.includes('study') || randomContext.includes('learn') || randomContext.includes('education')) {
            answer = 'effective';
          } else if (randomContext.includes('research') || randomContext.includes('science')) {
            answer = 'comprehensive';
          } else {
            answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
          }
        }
        
        return {
          text: trimmed,
          hasBlank: true,
          blankIndex,
          answer,
          id: index
        };
      }
      return {
        text: trimmed,
        hasBlank: false,
        id: index
      };
    });
  };

  const parsedContent = parseContentWithAnswers(content);
  // Limit to only 4 fill-in-the-blank items
const limitedContent = parsedContent.filter(item => item.hasBlank).slice(0, 4);


  const toggleAnswer = (id) => {
    setShowAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const borderClasses = theme === 'light' ? 'border-gray-200' : 'border-gray-600';
  const bgClasses = theme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const textClasses = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className="space-y-4">
      {limitedContent.map((item) =>  {
        // if (!item.hasBlank) {
        //   return (
        //     <p key={item.id} className={`${textClasses} leading-relaxed`}>
        //       {item.text}.
        //     </p>
        //   );
        // }

        const words = item.text.split(' ');
        
        return (
          <div key={item.id} className={`border rounded-lg p-4 ${borderClasses} ${bgClasses}`}>
            <div className="mb-3">
              {words.map((word, wordIndex) => {
                if (word === '_____') {
                  return (
                    <span
                      key={wordIndex}
                      className={`inline-block mx-1 px-3 py-1 border-b-2 border-dashed transition-all duration-200 ${
                        showAnswers[item.id] 
                          ? 'border-green-500 bg-green-100 text-green-800 font-medium' 
                          : theme === 'light'
                            ? 'border-gray-400 bg-white'
                            : 'border-gray-500 bg-gray-600'
                      }`}
                      style={{ minWidth: '80px', textAlign: 'center' }}
                    >
                      {showAnswers[item.id] ? item.answer : ''}
                    </span>
                  );
                }
                return <span key={wordIndex} className={textClasses}>{word} </span>;
              })}
            </div>
            
            <button
              onClick={() => toggleAnswer(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                showAnswers[item.id]
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {showAnswers[item.id] ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Answer</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show Answer</span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}