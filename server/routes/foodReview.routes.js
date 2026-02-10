const router = require("express").Router();
const { createReview } = require("../controllers/foodReview.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createReview);

module.exports = router;
