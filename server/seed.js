require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/User");

const demoUsers = [
  {
    name: "Raghav",
    email: "raghav@vit.ac.in",
    password: "123456",
    mealCoins: 120
  },
  {
    name: "Yash",
    email: "yash@vit.ac.in",
    password: "123456",
    mealCoins: 95
  },
  {
    name: "Aman",
    email: "aman@vit.ac.in",
    password: "123456",
    mealCoins: 80
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
