import { pipeline, env } from '@xenova/transformers';

env.allowRemoteModels = true;
env.allowLocalModels = false;

let summarizer = null;
let questionGenerator = null;
let fillMaskModel = null;
let modelsLoadingPromise = null;

let modelsLoaded = {
  summary: false,
  mcq: false,
  fill: false,
};

let fillInTheBlanksAnswers = {};

export async function loadModels(onProgress) {
  if (modelsLoadingPromise) return modelsLoadingPromise;
  if (summarizer && questionGenerator && fillMaskModel) {
    console.log('Models already loaded, skipping reload');
    return Promise.resolve();
  }

  modelsLoadingPromise = (async () => {
    const totalModels = 3;
    let loadedCount = 0;
    const updateProgress = (modelName) => {
      loadedCount++;
      onProgress && onProgress(loadedCount, totalModels, modelName);
    };

    try {
      if (!summarizer) {
        summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
        modelsLoaded.summary = true;
        updateProgress('Summarizer');
      }
    } catch (e) {
      console.warn('Summarizer load failed:', e.message);
    }

    try {
      if (!questionGenerator) {
        questionGenerator = await pipeline('text2text-generation', 'Xenova/flan-t5-base');
        modelsLoaded.mcq = true;
        updateProgress('Question Generator');
      }
    } catch (e) {
      console.warn('Question generator load failed:', e.message);
    }

    try {
      if (!fillMaskModel) {
        fillMaskModel = await pipeline('fill-mask', 'Xenova/distilroberta-base');
        modelsLoaded.fill = true;
        updateProgress('Fill Mask Model');
      }
    } catch (e) {
      console.warn('Fill-mask model load failed:', e.message);
    }

    modelsLoadingPromise = null;
  })();

  return modelsLoadingPromise;
}

export async function generateSummary(text) {
  if (!text || text.trim().length < 50) {
    return 'Text too short for summarization.';
  }

  if (modelsLoaded.summary && summarizer) {
    const result = await summarizer(text, {
      max_length: Math.floor(text.length * 0.7),
      min_length: 30,
      do_sample: false
    });
    return result[0].summary_text;
  }

  return generateExtractiveSummary(text);
}

export async function generateMCQs(text, numQuestions = 4) {
  if (!text || text.trim().length < 100) {
    return [{
      question: "Text too short for question generation",
      options: ["Provide more text", "Minimum 100 chars needed", "Try a longer passage", "All of the above"],
      correct: 3
    }];
  }

  return generateAdvancedMCQs(text, 4);
}

function generateAdvancedMCQs(text, numQuestions = 4) {
  const analysis = analyzeTextContent(text);
  const sentences = analysis.sentences;
  const questions = [];

  for (let i = 0; i < sentences.length && questions.length < 4; i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(' ').filter(w => w.length > 3);
    if (words.length < 6) continue;

    const answerIndex = Math.floor(words.length / 2);
    const correctAnswer = words[answerIndex];
    const question = sentence.replace(correctAnswer, '_____');

    const options = shuffleArray([
      correctAnswer,
      ...generatePlausibleDistractors(correctAnswer, analysis.words)
    ]).slice(0, 4);

    questions.push({
      question: `${question}`,
      options,
      correct: options.indexOf(correctAnswer)
    });
  }

  return questions.slice(0, 4);
}

function generatePlausibleDistractors(correct, words) {
  const pool = [...new Set(words.filter(w => w !== correct && w.length > 3))];
  return shuffleArray(pool).slice(0, 5);
}

export async function generateFillInTheBlanks(text) {
  if (!text || text.trim().length < 50) return "Text too short.";
  fillInTheBlanksAnswers = {};
  return await generateAdvancedFillBlanks(text);
}

async function generateAdvancedFillBlanks(text) {
  const analysis = analyzeTextContent(text);
  const sentences = analysis.sentences;
  const processed = [];
  let blanksCount = 0;

  for (let i = 0; i < sentences.length && blanksCount < 4; i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(' ');
    if (words.length < 6) continue;

    const target = selectBestWordForBlank(sentence, analysis);
    if (!target) continue;

    const index = words.findIndex(word => word.toLowerCase().replace(/[^\w]/g, '') === target.toLowerCase());
    if (index === -1) continue;

    fillInTheBlanksAnswers[i] = target;
    words[index] = '_____';
    processed.push(words.join(' '));
    blanksCount++;
  }

  return processed.join('. ').replace(/\.\./g, '.');
}

function analyzeTextContent(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  return { sentences, words };
}

function selectBestWordForBlank(sentence, analysis) {
  const words = sentence.split(' ').map(w => w.replace(/[^\w]/g, ''));
  const freq = {};
  analysis.words.forEach(word => freq[word] = (freq[word] || 0) + 1);

  const ranked = words.map(word => ({
    word,
    score: (word.length > 5 ? 2 : 1) + (freq[word.toLowerCase()] < 3 ? 1 : 0)
  }));

  ranked.sort((a, b) => b.score - a.score);
  return ranked.length ? ranked[0].word : null;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateExtractiveSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences.slice(0, 3).join('. ') + '.';
}

export function areModelsLoaded() {
  return summarizer && questionGenerator && fillMaskModel;
}

export function getFillInTheBlanksAnswers() {
  return fillInTheBlanksAnswers;
}
