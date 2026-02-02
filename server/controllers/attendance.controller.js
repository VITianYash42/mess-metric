const Attendance = require("../models/Attendance");
const User = require("../models/User");
const messTime = require("../config/messTime");

exports.markAttendance = async (req, res) => {
  try {
    const { mealType, faceVerified } = req.body;

    if (!faceVerified) {
      return res.status(403).json({ message: "Face not verified" });
    }

    const currentHour = new Date().getHours();
    const mealWindow = messTime[mealType];

    if (!mealWindow ||
        currentHour < mealWindow.start ||
        currentHour > mealWindow.end) {
      return res.status(403).json({ message: "Attendance window closed" });
    }

    const user = await User.findById(req.user.id);

    const alreadyMarked = await Attendance.findOne({
      user: user._id,
      mealType,
      date: new Date().toDateString()
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Already marked" });
    }

    await Attendance.create({
      user: user._id,
      mealType,
      faceVerified: true
    });

    user.mealCoins += 5;
    await user.save();

    res.json({
      message: "Attendance marked",
      mealCoins: user.mealCoins
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
