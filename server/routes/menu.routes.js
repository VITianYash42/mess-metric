const router = require("express").Router();
const { getFullMenu, getTodayMenu, updateMenu } = require("../controllers/menu.controller");

router.get("/", getFullMenu);
router.get("/today", getTodayMenu);
// allow both PUT and POST for backward compatibility
router.put("/", updateMenu);
router.post("/", updateMenu);

module.exports = router;
