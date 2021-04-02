const express = require("express");
const router = express.Router();
const RatingController = require("../controller/RatingController");
const BookController = require("../controller/BookController");
const auth = require("./auth");

router.get(
  "/createrating/:bookid/:score",
  auth,
  RatingController.ratingCreate,
  BookController.updateScore
);

module.exports = router;
