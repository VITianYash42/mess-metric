import { useState } from "react";
import axios from "axios";
import { Star, Send, MessageSquare, Coffee, Sun, Sunset, Moon, CheckCircle2, Lock, CalendarCheck, AlertTriangle, Sparkles, Activity } from "lucide-react";

export function DailyFoodReview() {
  const meals = [
    { id: "Breakfast", icon: Coffee, label: "Breakfast" },
    { id: "Lunch", icon: Sun, label: "Lunch" },
    { id: "Snacks", icon: Sunset, label: "Snacks" },
    { id: "Dinner", icon: Moon, label: "Dinner" },
  ];

  const quickTags = [
    "Delicious 😋", "Too Spicy 🌶️", "Cold Food ❄️", 
    "Good Portion 🍱", "Undercooked 🧂", "Healthy 🥗", 
    "Oily 🛢️", "Best Meal of Week 🏆"
  ];

  const [selectedMeal, setSelectedMeal] = useState("Lunch");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  
  // AI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isSubmittedAnimation, setIsSubmittedAnimation] = useState(false);
  
  const [reviewedMeals, setReviewedMeals] = useState(() => {
    const saved = localStorage.getItem("messMetric_reviews");
    if (saved) {
      const { date, mealIds } = JSON.parse(saved);
      const today = new Date().toDateString();
      return date === today ? mealIds : [];
    }
    return [];
  });

  const isMealLocked = reviewedMeals.includes(selectedMeal);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Helper to determine Ticket Priority based on AI Score
  const getAiStatus = (score) => {
    if (score < -0.2) return { 
      label: "HIGH PRIORITY TICKET", 
      color: "bg-red-50 text-red-700 border-red-200", 
      icon: AlertTriangle,
      message: "Flagged for Manager Review"
    };
    if (score > 0.2) return { 
      label: "APPRECIATION NOTE", 
      color: "bg-green-50 text-green-700 border-green-200", 
      icon: Sparkles,
      message: "Shared with Kitchen Staff"
    };
    return { 
      label: "GENERAL FEEDBACK", 
      color: "bg-blue-50 text-blue-700 border-blue-200", 
      icon: Activity,
      message: "Recorded in Database"
    };
  };

  const handleSubmit = async () => {
    if (rating === 0) return; 

    setIsAnalyzing(true);
    let analysis = null;

    // 1. Call AI if there is a comment
    if (comment.trim().length > 3) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.post(`${API_URL}/api/ai/analyze`, {
          feedback: comment
        });
        if (response.data.success) {
          analysis = response.data.data.analysis;
        }
      } catch (error) {
        console.error("AI Offline, proceeding with local save.");
      }
    }

    setAiResult(analysis);
    setIsSubmittedAnimation(true);
    setIsAnalyzing(false);

    // 2. Save to backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/api/food-reviews`,
        {
          mealType: selectedMeal,
          rating,
          tags: selectedTags,
          comment: comment.trim(),
          aiAnalysis: analysis ? { score: analysis.score, keywords: analysis.keywords || [] } : null
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
    } catch (backendError) {
      console.error("Failed to save review to backend:", backendError);
    }

    // 3. Save locally (fallback for reviewedMeals state)
    const updatedReviewed = [...reviewedMeals, selectedMeal];
    setReviewedMeals(updatedReviewed);

    localStorage.setItem("messMetric_reviews", JSON.stringify({
      date: new Date().toDateString(),
      mealIds: updatedReviewed
    }));

    // Reset after 4 seconds (giving time to read AI result)
    setTimeout(() => {
      setIsSubmittedAnimation(false);
      setRating(0);
      setSelectedTags([]);
      setComment("");
      setAiResult(null);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-800">Review Today's Food</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        
        {/* SUCCESS / AI RESULT SCREEN */}
        {isSubmittedAnimation ? (
          <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 p-6">
            
            {/* Standard Success */}
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">Feedback Submitted!</h3>
            <p className="text-slate-500 text-sm mb-6">+5 Coins Added to Wallet</p>

            {/* AI ANALYSIS CARD */}
            {aiResult ? (
              <div className={`w-full max-w-md p-4 rounded-xl border ${getAiStatus(aiResult.score).color} animate-in slide-in-from-bottom-4 fade-in duration-700`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-full bg-opacity-50">
                     {(() => {
                        const Icon = getAiStatus(aiResult.score).icon;
                        return <Icon className="w-5 h-5" />;
                     })()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold opacity-70">AI CATEGORIZATION</p>
                    <p className="font-bold">{getAiStatus(aiResult.score).label}</p>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-60 rounded-lg p-3 text-left text-sm mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="opacity-70">Action Taken:</span>
                    <span className="font-semibold">{getAiStatus(aiResult.score).message}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Sentiment Score:</span>
                    <span className="font-mono font-bold">{aiResult.score}</span>
                  </div>
                  {aiResult.keywords.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/10">
                      <span className="opacity-70 text-xs">Detected Topics: </span>
                      <span className="font-medium">{aiResult.keywords.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // If no text was written, just show this
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-full font-medium text-sm">
                <span>Thanks for rating! Write a comment next time for AI Analysis.</span>
              </div>
            )}

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            
            {/* Sidebar (Meals) */}
            <div className="bg-slate-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Select Meal</h3>
              {meals.map((m) => {
                const Icon = m.icon;
                const isActive = selectedMeal === m.id;
                const isDone = reviewedMeals.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMeal(m.id)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-200 relative overflow-hidden ${
                      isActive 
                        ? "bg-white shadow-md shadow-slate-200 ring-1 ring-emerald-100" 
                        : "hover:bg-white hover:shadow-sm text-slate-500"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? "bg-emerald-500 text-white" : isDone ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    
                    <span className={`font-bold ${isActive ? "text-slate-800" : "text-slate-500"}`}>
                      {m.label}
                    </span>
                    
                    {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />}
                    
                    {!isActive && isDone && (
                      <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Form */}
            <div className="col-span-1 md:col-span-2 p-6 md:p-8 relative">
              
              {isMealLocked ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                  <div className="bg-slate-100 p-6 rounded-full mb-4">
                    <CalendarCheck className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    Review Submitted
                  </h3>
                  <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                    You have already reviewed <span className="font-bold text-slate-800">{selectedMeal}</span>. 
                    <br />Come back tomorrow!
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  {/* Rating Stars */}
                  <div className="mb-8 text-center md:text-left">
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      How was the {selectedMeal}?
                    </label>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star 
                            className={`w-10 h-10 ${
                              star <= (hoveredRating || rating) 
                                ? "fill-amber-400 text-amber-400" 
                                : "fill-slate-100 text-slate-300"
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-lg font-bold text-slate-400 w-8">
                        {hoveredRating || rating ? (hoveredRating || rating) + "/5" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Quick Tags */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Quick Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-slate-700">
                        Additional Comments
                      </label>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        AI Enabled 🧠
                      </span>
                    </div>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us if the food was cold, spicy, or delicious... (AI will analyze this)"
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-24 text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      disabled={rating === 0 || isAnalyzing}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${
                        rating === 0 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200"
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}