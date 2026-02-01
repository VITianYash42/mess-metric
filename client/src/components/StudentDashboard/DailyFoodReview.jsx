import { useState } from "react";
import { Star, Send, MessageSquare, Coffee, Sun, Sunset, Moon, CheckCircle2, Lock, CalendarCheck } from "lucide-react";

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

  const handleSubmit = () => {
    if (rating === 0) return; 

    setIsSubmittedAnimation(true);

    const updatedReviewed = [...reviewedMeals, selectedMeal];
    setReviewedMeals(updatedReviewed);

    localStorage.setItem("messMetric_reviews", JSON.stringify({
      date: new Date().toDateString(),
      mealIds: updatedReviewed
    }));

    setTimeout(() => {
      setIsSubmittedAnimation(false);
      setRating(0);
      setSelectedTags([]);
      setComment("");
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-800">Review Today's Food</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        
        {isSubmittedAnimation ? (
          <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Feedback Sent!</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Your review for <span className="font-bold text-emerald-600">{selectedMeal}</span> has been recorded.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full font-bold">
              <span>+5 Coins Earned</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            
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
                    You have already reviewed <span className="font-bold text-slate-800">{selectedMeal}</span> for today. 
                    <br />You can review this meal again tomorrow!
                  </p>
                  
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-left max-w-md">
                    <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-xs text-emerald-800">
                      <strong>Tip:</strong> Select a different meal from the sidebar (like Dinner or Snacks) if you haven't reviewed them yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  
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

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Additional Comments (Optional)
                    </label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more about the taste, hygiene, or suggestions..."
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-24 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      disabled={rating === 0}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${
                        rating === 0 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      Submit Review
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