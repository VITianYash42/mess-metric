const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const connectDB = require('./config/db');
const Menu = require('./models/Menu');

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

async function seedMenu() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Remove old menu documents
    await Menu.deleteMany();
    console.log('Old menus removed');

    // Build rawWeeklyMenu from DEFAULT_WEEKLY_MENU
    const rawWeeklyMenu = DEFAULT_WEEKLY_MENU.map(({ day, meals }) => {
      const entry = { day, breakfast: [], lunch: [], snacks: [], dinner: [] };

      meals.forEach((m) => {
        const item = {
          name: m.menu,
          description: '',
          vegetarian: false,
          calories: m.calories || undefined,
          notes: ''
        };

        if (m.type.toLowerCase() === 'breakfast') entry.breakfast.push(item);
        else if (m.type.toLowerCase() === 'lunch') entry.lunch.push(item);
        else if (m.type.toLowerCase() === 'snacks') entry.snacks.push(item);
        else if (m.type.toLowerCase() === 'dinner') entry.dinner.push(item);
      });

      return entry;
    });

    const menuDoc = await Menu.create({ weeklyMenu: DEFAULT_WEEKLY_MENU, rawWeeklyMenu });
    console.log('Menu seeded successfully:', menuDoc._id);
    process.exit(0);
  } catch (err) {
    console.error('Menu seeding failed:', err);
    process.exit(1);
  }
}

seedMenu();
