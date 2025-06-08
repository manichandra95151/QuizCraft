import { FileText, HelpCircle, Edit3} from 'lucide-react';
import StudyMaterialCard from './card.js';
import  { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ResultsSection = () => {
   const { results, generating, theme,isGenerating } = useContext(AppContext);
  const hasResults = results.summary || results.mcqs.length > 0 || results.fillblanks;
  // console.log(generating);
  // console.log(results);

  return (
              <div className="space-y-6">
            {!hasResults && !isGenerating && (
              <div className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors duration-300 ${
                theme === 'light' 
                  ? 'bg-white border-gray-300' 
                  : 'bg-gray-800 border-gray-600'
              }`}>
                <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                }`}>
                  <FileText className={`w-8 h-8 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  No Results Yet
                </h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Enter some text and click "Generate" to create AI-powered summaries, questions, and exercises.
                </p>
              </div>
            )}

            {(hasResults || isGenerating) && (
              <div className="space-y-6">
                <StudyMaterialCard
                  title="Summary"
                  icon={<FileText className="w-5 h-5" />}
                  content={results.summary}
                  type="summary"
                  isLoading={generating.summary}
                  theme={theme}
                />

                <StudyMaterialCard
                  title="Multiple Choice Questions"
                  icon={<HelpCircle className="w-5 h-5" />}
                  content={results.mcqs}
                  type="mcq"
                  isLoading={generating.mcq}
                  theme={theme}
                />

                <StudyMaterialCard
                  title="Fill in the Blanks"
                  icon={<Edit3 className="w-5 h-5" />}
                  content={results.fillblanks}
                  type="fillblanks"
                  isLoading={generating.fillblanks}
                  theme={theme}
                />
              </div>
            )}
          </div>
  );
};

export default ResultsSection;