// top of seed.js and seed_menu.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/User");

const demoUsers = [
  {
    name: "Raghav",
    registrationNo: "24BCE10427",
    email: "raghav@vitbhopal.ac.in",
    password: "Raghav123@",
    messName: "Safal",
    mealCoins: 120
  },
  {
    name: "Yash",
    registrationNo: "24BCE10465",
    email: "yash@vitbhopal.ac.in",
    password: "Yash2024@",
    messName: "JMB",
    mealCoins: 95
  },
  {
    name: "Aman",
    registrationNo: "24BCE10500",
    email: "aman@vitbhopal.ac.in",
    password: "Aman2024@",
    messName: "Mayuri",
    mealCoins: 80
  },
  {
    name: "Kevin",
    registrationNo: "24BCE10550",
    email: "priya@vitbhopal.ac.in",
    password: "Priya2024@",
    messName: "Safal",
    mealCoins: 110
  }
];

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    console.log("Old users removed");

    for (let user of demoUsers) {
      user.password = await bcrypt.hash(user.password, 10);
      await User.create(user);
    }

    console.log("Demo users inserted successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
};

seedUsers();
