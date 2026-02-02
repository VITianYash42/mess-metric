const router = require("express").Router();
const { getLeaderboard } = require("../controllers/leaderboard.controller");

router.get("/", getLeaderboard);

module.exports = router;
