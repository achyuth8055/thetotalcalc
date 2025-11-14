"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import confetti from "canvas-confetti";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

const MAX_QUESTIONS = 15;

export default function MathQuizPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [selectedTopic, setSelectedTopic] = useState<string>("addition");
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerDuration, setTimerDuration] = useState(10);
  const [timerPaused, setTimerPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [questionQueue, setQuestionQueue] = useState<QuizQuestion[]>([]);

  const topics = [
    { id: "addition", name: "Addition", emoji: "➕" },
    { id: "subtraction", name: "Subtraction", emoji: "➖" },
    { id: "multiplication", name: "Multiplication", emoji: "✖️" },
    { id: "division", name: "Division", emoji: "➗" },
    { id: "fractions", name: "Fractions", emoji: "½" },
    { id: "decimals", name: "Decimals", emoji: "0.5" },
  ];

  const loadQuestion = useCallback(async () => {
    setIsLoading(true);
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(timerDuration);
    setTimerPaused(false);
    setError(null);

    try {
      // First check if we have questions in queue
      if (questionQueue.length > 0) {
        const question = questionQueue[0];
        setCurrentQuestion(question);
        setQuestionQueue(prev => prev.slice(1));
        setUsedQuestionIds(prev => [...prev, question.id]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          difficulty: selectedDifficulty, 
          topic: selectedTopic,
          usedQuestionIds: usedQuestionIds,
          generateBatch: 5 // Generate 5 questions at once
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle batch response (array of questions) or single question
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error("No unique questions available");
        }
        
        // Use first question immediately, queue the rest
        const [firstQuestion, ...restQuestions] = data;
        setCurrentQuestion(firstQuestion);
        setQuestionQueue(restQuestions);
        setUsedQuestionIds(prev => [...prev, firstQuestion.id]);
      } else {
        // Single question response (fallback)
        const question: QuizQuestion = data;
        
        // Validate question structure
        if (!question || !question.question || !Array.isArray(question.options) || 
            typeof question.correctAnswer !== 'number') {
          throw new Error("Invalid question format received");
        }
        
        setCurrentQuestion(question);
        setUsedQuestionIds(prev => [...prev, question.id]);
      }
    } catch (error) {
      console.error("Error loading question:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      // Fallback to a sample question if API fails
      const fallbackQuestion = getFallbackQuestion();
      setCurrentQuestion(fallbackQuestion);
      setUsedQuestionIds(prev => [...prev, fallbackQuestion.id]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty, selectedTopic, timerDuration, usedQuestionIds, questionQueue]);

  // Background question loading to keep queue filled
  const loadBackgroundQuestions = useCallback(async () => {
    // Only load if queue is getting low and we haven't used too many questions
    if (questionQueue.length >= 2 || usedQuestionIds.length >= 15) return;
    
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          difficulty: selectedDifficulty, 
          topic: selectedTopic,
          usedQuestionIds: [...usedQuestionIds, ...questionQueue.map(q => q.id)],
          generateBatch: 5
        }),
      });

      if (response.ok) {
        const newQuestions = await response.json();
        if (Array.isArray(newQuestions) && newQuestions.length > 0) {
          setQuestionQueue(prev => [...prev, ...newQuestions]);
        }
      }
    } catch (error) {
      console.error("Background question loading failed:", error);
    }
  }, [selectedDifficulty, selectedTopic, usedQuestionIds, questionQueue]);

  // Effect to trigger background loading
  useEffect(() => {
    if (totalQuestions > 0 && totalQuestions < 12 && questionQueue.length < 2) {
      loadBackgroundQuestions();
    }
  }, [totalQuestions, questionQueue.length, loadBackgroundQuestions]);

  // Timer countdown effect
  useEffect(() => {
    if (!currentQuestion || showResult || quizCompleted || timerPaused || isLoading) return;

    if (timeLeft <= 0) {
      // Time's up - treat as wrong answer
      handleAnswer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion, showResult, quizCompleted, timerPaused, isLoading]);

  const getFallbackQuestion = useCallback((): QuizQuestion => {
    const fallbackQuestions: Record<string, QuizQuestion[]> = {
      addition: [
        {
          id: "fallback-add-1",
          question: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 2,
          explanation: "5 + 3 = 8. Count 5 items and add 3 more items to get 8 total.",
          difficulty: selectedDifficulty,
          topic: "addition",
        },
        {
          id: "fallback-add-2",
          question: "What is 7 + 2?",
          options: ["8", "9", "10", "11"],
          correctAnswer: 1,
          explanation: "7 + 2 = 9. Start with 7 and add 2 more to get 9.",
          difficulty: selectedDifficulty,
          topic: "addition",
        },
      ],
      subtraction: [
        {
          id: "fallback-sub-1",
          question: "What is 10 - 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 1,
          explanation: "10 - 3 = 7. Start with 10 and take away 3 to get 7.",
          difficulty: selectedDifficulty,
          topic: "subtraction",
        },
      ],
      multiplication: [
        {
          id: "fallback-mul-1",
          question: "What is 4 × 2?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 2,
          explanation: "4 × 2 = 8. Four groups of 2 equals 8.",
          difficulty: selectedDifficulty,
          topic: "multiplication",
        },
      ],
      division: [
        {
          id: "fallback-div-1",
          question: "What is 12 ÷ 3?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "12 ÷ 3 = 4. Twelve divided into 3 equal groups gives 4 in each group.",
          difficulty: selectedDifficulty,
          topic: "division",
        },
      ],
      fractions: [
        {
          id: "fallback-frac-1",
          question: "What is 1/2 + 1/4?",
          options: ["1/4", "2/4", "3/4", "4/4"],
          correctAnswer: 2,
          explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
          difficulty: selectedDifficulty,
          topic: "fractions",
        },
      ],
      decimals: [
        {
          id: "fallback-dec-1",
          question: "What is 0.5 + 0.3?",
          options: ["0.7", "0.8", "0.9", "1.0"],
          correctAnswer: 1,
          explanation: "0.5 + 0.3 = 0.8",
          difficulty: selectedDifficulty,
          topic: "decimals",
        },
      ],
    };

    const topicQuestions = fallbackQuestions[selectedTopic] || fallbackQuestions.addition;
    const randomIndex = Math.floor(Math.random() * topicQuestions.length);
    return topicQuestions[randomIndex];
  }, [selectedDifficulty, selectedTopic]);

  useEffect(() => {
    if (!quizCompleted && totalQuestions < MAX_QUESTIONS) {
      loadQuestion();
    }
  }, [selectedDifficulty, selectedTopic]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setTimerPaused(true);
    setSelectedAnswer(index);
    setShowResult(true);
    const newTotal = totalQuestions + 1;
    const isCorrect = currentQuestion && index >= 0 && index === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    
    setTotalQuestions(newTotal);
    if (isCorrect) {
      setScore(newScore);
    }

    // Check if quiz is complete
    if (newTotal >= MAX_QUESTIONS) {
      setQuizCompleted(true);
      // Perfect score celebration
      if (newScore === MAX_QUESTIONS) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB']
          });
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 }
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 }
            });
          }, 250);
        }, 500);
      }
    } else {
      // Auto-advance to next question after 5 seconds
      setTimeout(() => {
        if (totalQuestions < MAX_QUESTIONS) {
          loadQuestion();
        }
      }, 5000);
    }
  };

  const handleNext = () => {
    if (totalQuestions < MAX_QUESTIONS) {
      loadQuestion();
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setQuizCompleted(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(timerDuration);
    setTimerPaused(false);
    setUsedQuestionIds([]);
    setQuestionQueue([]);
    loadQuestion();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Math Quiz", href: "/calculators/math/math-quiz" },
        ]}
      />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-gray-900">Math Quiz for Kids</h1>
          <span className="text-4xl">🎓</span>
        </div>
        <p className="text-base text-gray-600">
          Practice your math skills with fun, timed questions!
        </p>
      </div>

      {/* Compact Settings Row - Topic, Difficulty, Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Topic Selection - Compact */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 mb-2">📚 Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); restartQuiz(); }}
            disabled={totalQuestions > 0 && !quizCompleted}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.emoji} {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selection - Compact */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 mb-2">⚡ Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value as "easy" | "medium" | "hard"); restartQuiz(); }}
            disabled={totalQuestions > 0 && !quizCompleted}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="easy">😊 Easy</option>
            <option value="medium">🤔 Medium</option>
            <option value="hard">🤯 Hard</option>
          </select>
        </div>

        {/* Timer Setting - Compact */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 mb-2">⏱️ Timer (seconds)</label>
          <select
            value={timerDuration}
            onChange={(e) => { setTimerDuration(Number(e.target.value)); setTimeLeft(Number(e.target.value)); }}
            disabled={totalQuestions > 0 && !quizCompleted}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={5}>5 seconds</option>
            <option value={10}>10 seconds</option>
            <option value={15}>15 seconds</option>
            <option value={20}>20 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-purple-600 rounded-xl shadow-lg p-4 mb-6 text-white">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="text-xs font-medium opacity-90">Progress</div>
            <div className="text-2xl font-bold">{totalQuestions}/{MAX_QUESTIONS}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium opacity-90">Score</div>
            <div className="text-2xl font-bold">{score}/{totalQuestions}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-medium opacity-90">Accuracy</div>
            <div className="text-2xl font-bold">{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${(totalQuestions / MAX_QUESTIONS) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Completion Screen */}
      {quizCompleted ? (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-gray-200 text-center">
          <div className="text-6xl mb-4">
            {score === MAX_QUESTIONS ? "🎉" : score >= MAX_QUESTIONS * 0.8 ? "🌟" : score >= MAX_QUESTIONS * 0.6 ? "👏" : "💪"}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 mb-6">
            You scored <span className="font-bold text-purple-600">{score}</span> out of <span className="font-bold">{MAX_QUESTIONS}</span>
          </p>

          {score === MAX_QUESTIONS && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-6 mb-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">🏆 Perfect Score! 🏆</p>
              <p className="text-gray-700">Amazing work! You answered all questions correctly!</p>
            </div>
          )}

          {score >= MAX_QUESTIONS * 0.8 && score < MAX_QUESTIONS && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-xl font-bold text-gray-900 mb-2">Excellent Job!</p>
              <p className="text-gray-700">You're doing great! Keep practicing to reach perfection!</p>
            </div>
          )}

          {score >= MAX_QUESTIONS * 0.6 && score < MAX_QUESTIONS * 0.8 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-xl font-bold text-gray-900 mb-2">Good Work!</p>
              <p className="text-gray-700">Nice effort! Keep practicing to improve your score!</p>
            </div>
          )}

          {score < MAX_QUESTIONS * 0.6 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <p className="text-xl font-bold text-gray-900 mb-2">Keep Practicing!</p>
              <p className="text-gray-700">Don't give up! Practice makes perfect!</p>
            </div>
          )}

          <button
            onClick={restartQuiz}
            aria-label="Start a new quiz"
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-lg"
          >
            <span role="img" aria-label="Rocket">🚀</span> Start New Quiz
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-purple-200">
          {/* Timer Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Time Remaining</span>
              <span className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : timeLeft <= 5 ? 'text-orange-600' : 'text-purple-600'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${timeLeft <= 3 ? 'bg-red-600' : timeLeft <= 5 ? 'bg-orange-600' : 'bg-purple-600'}`}
                style={{ width: `${(timeLeft / timerDuration) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question - Large and Prominent */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
            <div className="text-xs font-bold text-purple-600 mb-2">QUESTION {totalQuestions + 1}</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" role="heading" aria-level={2}>
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = currentQuestion.correctAnswer === index;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  aria-pressed={isSelected}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left font-semibold transition-all text-sm sm:text-base ${
                    showCorrect
                      ? "bg-green-100 border-green-500 text-green-900"
                      : showIncorrect
                      ? "bg-red-100 border-red-500 text-red-900"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {selectedAnswer === currentQuestion.correctAnswer ? "🎉" : "💡"}
                </span>
                <span className="font-bold text-lg">
                  {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite!"}
                </span>
              </div>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {showResult && totalQuestions < MAX_QUESTIONS && (
            <button
              onClick={handleNext}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Next Question ({totalQuestions}/{MAX_QUESTIONS}) →
            </button>
          )}

          {showResult && totalQuestions >= MAX_QUESTIONS && (
            <button
              onClick={restartQuiz}
              aria-label="View quiz results"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <span role="img" aria-label="Target">🎯</span> View Results
            </button>
          )}
        </div>
      ) : null}

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">💪</span> Tips for Success
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Start with Easy difficulty and work your way up</li>
          <li>• Read each question carefully before answering</li>
          <li>• Learn from the explanations, even when you get it right</li>
          <li>• Practice regularly to improve your skills</li>
        </ul>
      </div>
    </div>
  );
}
