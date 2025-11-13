import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

// Path to JSON file storing cached questions
const QUESTIONS_FILE = path.join(process.cwd(), "data", "quiz-questions.json");

// Ensure questions file exists
function ensureQuestionsFile() {
  const dir = path.dirname(QUESTIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([], null, 2));
  }
}

// Load cached questions
function loadCachedQuestions(): QuizQuestion[] {
  try {
    ensureQuestionsFile();
    const data = fs.readFileSync(QUESTIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading cached questions:", error);
    return [];
  }
}

// Save question to cache
function saveQuestionToCache(question: QuizQuestion) {
  try {
    const questions = loadCachedQuestions();
    questions.push(question);
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error("Error saving question to cache:", error);
  }
}

// Generate question using simple algorithm (fallback)
function generateSimpleQuestion(difficulty: string, topic: string): QuizQuestion {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 100 },
  };

  const range = ranges[difficulty as keyof typeof ranges] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  let question: string;
  let correctAnswer: number;
  let explanation: string;

  switch (topic) {
    case "addition":
      correctAnswer = num1 + num2;
      question = `What is ${num1} + ${num2}?`;
      explanation = `${num1} + ${num2} = ${correctAnswer}. Add the two numbers together.`;
      break;
    case "subtraction":
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      correctAnswer = larger - smaller;
      question = `What is ${larger} - ${smaller}?`;
      explanation = `${larger} - ${smaller} = ${correctAnswer}. Subtract the smaller number from the larger.`;
      break;
    case "multiplication":
      correctAnswer = num1 * num2;
      question = `What is ${num1} × ${num2}?`;
      explanation = `${num1} × ${num2} = ${correctAnswer}. Multiply the two numbers.`;
      break;
    case "division":
      const dividend = num1 * num2;
      correctAnswer = num1;
      question = `What is ${dividend} ÷ ${num2}?`;
      explanation = `${dividend} ÷ ${num2} = ${correctAnswer}. Divide ${dividend} by ${num2}.`;
      break;
    case "fractions":
      correctAnswer = num1 + num2;
      question = `What is ${num1}/10 + ${num2}/10? (Express as a fraction with denominator 10)`;
      explanation = `${num1}/10 + ${num2}/10 = ${correctAnswer}/10. Add the numerators when denominators are the same.`;
      break;
    case "decimals":
      const dec1 = (num1 / 10).toFixed(1);
      const dec2 = (num2 / 10).toFixed(1);
      correctAnswer = parseFloat(dec1) + parseFloat(dec2);
      question = `What is ${dec1} + ${dec2}?`;
      explanation = `${dec1} + ${dec2} = ${correctAnswer.toFixed(1)}. Add the decimal numbers.`;
      break;
    default:
      correctAnswer = num1 + num2;
      question = `What is ${num1} + ${num2}?`;
      explanation = `${num1} + ${num2} = ${correctAnswer}. Add the two numbers together.`;
  }

  // Generate wrong options
  const options: string[] = [];
  const correctAnswerStr = topic === "decimals" ? correctAnswer.toFixed(1) : correctAnswer.toString();
  options.push(correctAnswerStr);

  // Add 3 wrong options
  for (let i = 0; i < 3; i++) {
    let wrongAnswer: number;
    do {
      const offset = Math.floor(Math.random() * 10) + 1;
      wrongAnswer = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    } while (options.includes(wrongAnswer.toString()) || wrongAnswer < 0);
    
    const wrongAnswerStr = topic === "decimals" ? wrongAnswer.toFixed(1) : wrongAnswer.toString();
    options.push(wrongAnswerStr);
  }

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const correctIndex = options.indexOf(correctAnswerStr);

  return {
    id: `${topic}-${difficulty}-${Date.now()}`,
    question,
    options,
    correctAnswer: correctIndex,
    explanation,
    difficulty: difficulty as "easy" | "medium" | "hard",
    topic,
  };
}

// Generate question using Groq API
async function generateLLMQuestion(difficulty: string, topic: string): Promise<QuizQuestion | null> {
  const apiKey = "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";
  
  try {
    const groq = new Groq({ apiKey });
    
    const difficultyGuide = {
      easy: "suitable for ages 5-7, numbers 1-10, very simple operations",
      medium: "suitable for ages 8-10, numbers 10-50, moderate difficulty",
      hard: "suitable for ages 11+, numbers 50-100, challenging problems"
    };

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful math teacher creating engaging quiz questions for children. Always respond with valid JSON only, no additional text or markdown formatting.",
        },
        {
          role: "user",
          content: `Generate a ${difficulty} difficulty ${topic} math question for children (${difficultyGuide[difficulty as keyof typeof difficultyGuide]}).
          
          Requirements:
          - Create exactly 4 multiple choice options
          - Make the question clear and age-appropriate
          - Include an encouraging, child-friendly explanation
          - Ensure only one correct answer
          - Make wrong answers plausible but clearly incorrect
          
          Return ONLY a JSON object (no markdown, no code blocks) with this exact structure:
          {
            "question": "What is 5 + 3?",
            "options": ["6", "7", "8", "9"],
            "correctAnswer": 2,
            "explanation": "5 + 3 = 8. Great job!"
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;
    
    // Clean up any potential markdown formatting
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanContent);

    // Validate the response
    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4 || 
        typeof parsed.correctAnswer !== 'number' || !parsed.explanation) {
      console.error("Invalid question format from Groq:", parsed);
      return null;
    }

    return {
      id: `groq-${topic}-${difficulty}-${Date.now()}`,
      question: parsed.question,
      options: parsed.options,
      correctAnswer: parsed.correctAnswer,
      explanation: parsed.explanation,
      difficulty: difficulty as "easy" | "medium" | "hard",
      topic,
    };
  } catch (error) {
    console.error("Groq generation error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { difficulty = "easy", topic = "addition" } = body;

    // Load cached questions
    const cachedQuestions = loadCachedQuestions();
    
    // Filter questions by difficulty and topic
    const matchingQuestions = cachedQuestions.filter(
      (q) => q.difficulty === difficulty && q.topic === topic
    );

    // 50% chance to use cached question if available
    const useCached = matchingQuestions.length > 0 && Math.random() > 0.5;

    let question: QuizQuestion;

    if (useCached) {
      // Pick random cached question
      question = matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];
    } else {
      // Try LLM generation first, fall back to simple generation
      const llmQuestion = await generateLLMQuestion(difficulty, topic);
      
      if (llmQuestion) {
        question = llmQuestion;
        saveQuestionToCache(question);
      } else {
        // Generate simple question
        question = generateSimpleQuestion(difficulty, topic);
        saveQuestionToCache(question);
      }
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
