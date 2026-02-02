const router = require("express").Router();
const { markAttendance } = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");

router.post("/mark", auth, markAttendance);

module.exports = router;
