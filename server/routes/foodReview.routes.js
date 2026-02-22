const router = require("express").Router();
const { createReview, getAllReviews } = require("../controllers/foodReview.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createReview);

// admin can fetch all reviews
router.get("/", auth, getAllReviews);

module.exports = router;
