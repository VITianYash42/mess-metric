const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { requestSkip } = require("../controllers/skip.controller");

// rate-limited skip request
router.post("/skip", auth, requestSkip);

module.exports = router;
