"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/data/config";

export function TriviaGame({ onNext }: { onNext: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const question = siteConfig.gameQuestions[currentQIndex];

  const handleAnswer = (index: number) => {
    if (correctAnswer !== null) return; // prevent double clicks during transition

    if (index === question.correctAnswerIndex) {
      setCorrectAnswer(index);
      setWrongAnswer(null);

      try {
        confetti({
          particleCount: 20,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#ff4b82", "#ffd166", "#06d6a0", "#118ab2"],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setCorrectAnswer(null);
        if (currentQIndex < siteConfig.gameQuestions.length - 1) {
          setCurrentQIndex((prev) => prev + 1);
        } else {
          setCompleted(true);
          try {
            confetti({
              particleCount: 60,
              spread: 90,
              origin: { y: 0.5 },
            });
          } catch {
            // ignore
          }
        }
      }, 700);
    } else {
      setWrongAnswer(index);
      setTimeout(() => setWrongAnswer(null), 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center z-10 w-full max-w-xl px-4 min-h-[420px]"
    >
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.4 }}
            className="w-full cute-card p-6 md:p-10 cute-shadow relative overflow-hidden"
          >
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-brand-secondary font-bold tracking-widest text-xs uppercase bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
                Question {currentQIndex + 1} of {siteConfig.gameQuestions.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif mt-5 text-brand-text font-bold">
                {question.question}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {question.answers.map((answer, index) => {
                const isSelectedWrong = wrongAnswer === index;
                const isSelectedCorrect = correctAnswer === index;

                return (
                  <motion.button
                    key={index}
                    whileHover={correctAnswer === null ? { scale: 1.02, x: 3 } : {}}
                    whileTap={correctAnswer === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    animate={isSelectedWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`p-4 rounded-2xl text-left font-medium transition-all duration-300 border-2 cursor-pointer flex items-center justify-between ${
                      isSelectedCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md"
                        : isSelectedWrong
                        ? "border-rose-400 bg-rose-50 text-rose-600"
                        : "border-pink-100 bg-white hover:border-brand-primary hover:shadow-md text-brand-text"
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-center mr-3 font-bold text-sm transition-colors ${
                          isSelectedCorrect
                            ? "bg-emerald-200 text-emerald-800"
                            : isSelectedWrong
                            ? "bg-rose-200 text-rose-800"
                            : "bg-pink-50 text-brand-primary"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm md:text-base font-semibold">{answer}</span>
                    </div>

                    {isSelectedCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center cute-card p-10 md:p-14 cute-shadow"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-50 animate-pulse-ring" />
              <Sparkles className="w-16 h-16 text-brand-accent relative mx-auto" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif gradient-text mb-3 font-bold">
              Yay! You did it! 🎉
            </h2>
            <p className="text-gray-600 mb-8 font-medium">Ready for the next surprise?</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="btn-cute cursor-pointer inline-flex items-center gap-2"
            >
              <span>Continue</span>
              <span>✨</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
