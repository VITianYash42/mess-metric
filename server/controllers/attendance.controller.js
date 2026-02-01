const Attendance = require("../models/Attendance");
const User = require("../models/User");
const messTime = require("../config/messTime");

exports.markAttendance = async (req, res) => {
  try {
    const { email, mealType, faceVerified } = req.body;

    // 1️⃣ Face verification check
    if (!faceVerified) {
      return res.status(403).json({ message: "Face not verified" });
    }

    // 2️⃣ Time lock check
    const currentHour = new Date().getHours();
    const mealWindow = messTime[mealType];

    if (
      !mealWindow ||
      currentHour < mealWindow.start ||
      currentHour > mealWindow.end
    ) {
      return res.status(403).json({
        message: "Attendance window closed"
      });
    }

    // 3️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Prevent double attendance
    const alreadyMarked = await Attendance.findOne({
      user: user._id,
      mealType,
      date: new Date().toDateString()
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked"
      });
    }

    // 5️⃣ Save attendance
    const attendance = await Attendance.create({
      user: user._id,
      mealType,
      faceVerified: true
    });

    // 6️⃣ Reward mealCoins
    user.mealCoins += 5;
    await user.save();

    res.json({
      message: "Attendance marked successfully ✅",
      attendance,
      mealCoins: user.mealCoins
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
