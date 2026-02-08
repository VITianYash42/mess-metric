const Menu = require("../models/Menu");

const DEFAULT_WEEKLY_MENU = [
  { day: "Monday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Idli, Vada, Sambar, Chutney", calories: 400 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Rajma Chawal, Mix Veg, Curd, Roti", calories: 750 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Samosa, Tea", calories: 250 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Aloo Gobhi, Dal Fry, Rice, Chapati", calories: 600 },
  ]},
  { day: "Tuesday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Aloo Paratha, Curd, Pickle, Tea", calories: 500 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Chole Bhature, Salad, Lassi", calories: 850 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Pasta, Coffee", calories: 300 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Egg Curry, Jeera Rice, Salad", calories: 700 },
  ]},
  { day: "Wednesday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Poha, Jalebi, Sev, Tea", calories: 450 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Kadhi Pakora, Rice, Bhindi Fry", calories: 700 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Sandwich, Tea", calories: 200 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Chicken Biryani / Veg Biryani, Raita", calories: 900 },
  ]},
  { day: "Thursday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Uttapam, Coconut Chutney, Sambar", calories: 400 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Dal Makhani, Naan, Salad", calories: 800 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Maggi, Coffee", calories: 350 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Matar Paneer, Rice, Roti", calories: 650 },
  ]},
  { day: "Friday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Puri Bhaji, Halwa, Tea", calories: 600 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Sambhar Rice, Poriyal, Papad", calories: 700 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Bread Pakora, Tea", calories: 300 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Fish Curry / Malai Kofta, Rice", calories: 750 },
  ]},
  { day: "Saturday", meals: [
    { type: "Breakfast", time: "07:30 - 09:30", menu: "Pav Bhaji, Chopped Onions", calories: 550 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Khichdi, Begun Bhaja, Papad", calories: 500 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Biscuits, Tea", calories: 150 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Paneer Chilli, Fried Rice", calories: 800 },
  ]},
  { day: "Sunday", meals: [
    { type: "Breakfast", time: "08:00 - 10:00", menu: "Masala Dosa, Sambar, Chutney", calories: 450 },
    { type: "Lunch", time: "12:30 - 14:30", menu: "Chicken Curry / Paneer Butter Masala, Rice, Naan", calories: 950 },
    { type: "Snacks", time: "17:00 - 18:00", menu: "Corn Chat, Tea", calories: 200 },
    { type: "Dinner", time: "19:30 - 21:30", menu: "Light Khichdi, Dahi", calories: 400 },
  ]},
];

function buildWeeklyMenuObject(weeklyMenuArray) {
  if (!weeklyMenuArray || weeklyMenuArray.length === 0) return null;
  const obj = {};
  weeklyMenuArray.forEach(({ day, meals }) => {
    obj[day] = meals;
  });
  return obj;
}

/** GET /api/menu — full week menu (for dashboard that can switch days or show week) */
exports.getFullMenu = async (req, res) => {
  try {
    let menuDoc = await Menu.findOne();
    if (!menuDoc || !menuDoc.weeklyMenu || menuDoc.weeklyMenu.length === 0) {
      menuDoc = await Menu.create({ weeklyMenu: DEFAULT_WEEKLY_MENU });
    }
    const weeklyMenu = buildWeeklyMenuObject(menuDoc.weeklyMenu);
    res.json({ weeklyMenu, updatedAt: menuDoc.updatedAt });
  } catch (err) {
    console.error("getFullMenu error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch menu" });
  }
};

/** GET /api/menu/today — today's meals only (for dashboard default view) */
exports.getTodayMenu = async (req, res) => {
  try {
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    let menuDoc = await Menu.findOne();
    if (!menuDoc || !menuDoc.weeklyMenu || menuDoc.weeklyMenu.length === 0) {
      menuDoc = await Menu.create({ weeklyMenu: DEFAULT_WEEKLY_MENU });
    }
    const dayEntry = menuDoc.weeklyMenu.find((d) => d.day === dayName);
    const meals = dayEntry ? dayEntry.meals : (menuDoc.weeklyMenu[0]?.meals || []);
    res.json({ day: dayName, meals });
  } catch (err) {
    console.error("getTodayMenu error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch today's menu" });
  }
};
