const router = require("express").Router();
const { getFullMenu, getTodayMenu } = require("../controllers/menu.controller");

router.get("/", getFullMenu);
router.get("/today", getTodayMenu);

module.exports = router;
