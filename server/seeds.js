require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// 1️⃣ CONNECT TO DB
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

// 2️⃣ DEMO USERS (EDIT THIS ARRAY)
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

// 3️⃣ SEED FUNCTION
const seedUsers = async () => {
  try {
    await connectDB();

    // Optional: clear existing users
    await User.deleteMany();
    console.log("Old users removed");

    // Hash passwords & insert users
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
