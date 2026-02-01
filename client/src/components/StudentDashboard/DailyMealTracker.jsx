import { useState } from "react";
import { Coffee, Sun, Sunset, Moon, Check, X } from "lucide-react";

const weeklyMenu = {
  Monday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Idli, Vada, Sambar, Chutney", calories: 400, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Rajma Chawal, Mix Veg, Curd, Roti", calories: 750, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Samosa, Tea", calories: 250, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Aloo Gobhi, Dal Fry, Rice, Chapati", calories: 600, icon: Moon },
  ],
  Tuesday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Aloo Paratha, Curd, Pickle, Tea", calories: 500, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Chole Bhature, Salad, Lassi", calories: 850, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Pasta, Coffee", calories: 300, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Egg Curry, Jeera Rice, Salad", calories: 700, icon: Moon },
  ],
  Wednesday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Poha, Jalebi, Sev, Tea", calories: 450, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Kadhi Pakora, Rice, Bhindi Fry", calories: 700, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Sandwich, Tea", calories: 200, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Chicken Biryani / Veg Biryani, Raita", calories: 900, icon: Moon },
  ],
  Thursday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Uttapam, Coconut Chutney, Sambar", calories: 400, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Dal Makhani, Naan, Salad", calories: 800, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Maggi, Coffee", calories: 350, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Matar Paneer, Rice, Roti", calories: 650, icon: Moon },
  ],
  Friday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Puri Bhaji, Halwa, Tea", calories: 600, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Sambhar Rice, Poriyal, Papad", calories: 700, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Bread Pakora, Tea", calories: 300, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Fish Curry / Malai Kofta, Rice", calories: 750, icon: Moon },
  ],
  Saturday: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Pav Bhaji, Chopped Onions", calories: 550, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Khichdi, Begun Bhaja, Papad", calories: 500, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Biscuits, Tea", calories: 150, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Paneer Chilli, Fried Rice", calories: 800, icon: Moon },
  ],
  Sunday: [
    { type: "Breakfast", time: "08:00 - 10:00", menu: "Masala Dosa, Sambar, Chutney", calories: 450, icon: Coffee },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Chicken Curry / Paneer Butter Masala, Rice, Naan", calories: 950, icon: Sun },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Corn Chat, Tea", calories: 200, icon: Sunset },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Light Khichdi, Dahi", calories: 400, icon: Moon },
  ],
};

export function DailyMealTracker() {
  const studentName = "Alex";
  
  const todayDate = new Date();
  const currentDayName = todayDate.toLocaleDateString('en-US', { weekday: 'long' }); 
  const formattedDate = todayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });


  const [mealStatus, setMealStatus] = useState(() => {
    const todaysMenu = weeklyMenu[currentDayName] || weeklyMenu["Monday"];
    
    return todaysMenu.map((meal, index) => ({
      ...meal,
      id: index,
      isEating: true
    }));
  });

  const toggleMeal = (id) => {
    setMealStatus((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === id ? { ...meal, isEating: !meal.isEating } : meal
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Good Morning, <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{studentName}</span> 👋
        </h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <span className="bg-emerald-100 px-2 py-0.5 rounded text-sm font-bold text-emerald-800">
            {currentDayName}
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-sm font-medium text-slate-600">
            {formattedDate}
          </span>
          <span className="text-sm hidden sm:inline">- Don't forget to mark your meals for today.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mealStatus.map((meal) => {
          const Icon = meal.icon;
          
          return (
            <div 
              key={meal.id} 
              className={`relative rounded-2xl border transition-all duration-300 ${
                meal.isEating 
                  ? "bg-white border-emerald-100 shadow-lg shadow-emerald-50" 
                  : "bg-slate-50 border-slate-200 opacity-90"
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${meal.isEating ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => toggleMeal(meal.id)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                      meal.isEating ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                        meal.isEating ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="mb-2">
                  <h3 className={`text-lg font-bold ${meal.isEating ? "text-slate-800" : "text-slate-500"}`}>
                    {meal.type}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">{meal.time}</p>
                </div>

                <div className="min-h-[60px]">
                  <p className={`text-sm leading-relaxed ${meal.isEating ? "text-slate-600" : "text-slate-400 line-through"}`}>
                    {meal.menu}
                  </p>
                </div>
              </div>

              <div className={`px-5 py-3 border-t rounded-b-2xl flex items-center justify-between text-xs font-medium ${
                meal.isEating 
                  ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" 
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}>
                <div className="flex items-center gap-1.5">
                  {meal.isEating ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {meal.isEating ? "Registered" : "Skipped"}
                </div>
                {!meal.isEating && (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    + Coin Refund
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}