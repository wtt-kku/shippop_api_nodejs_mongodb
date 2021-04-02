const Rating = require("../model/Rating");
const Book = require("../model/Book");
const mongoose = require("mongoose");

async function ratingCreate(req, res, next) {
  const bookID = req.params.bookid;
  const score = req.params.score;
  try {
    //Check Score
    if (!(score > 0 && score <= 5)) {
      const response = {
        status: 400,
        message: "Score Invalid.",
      };
      return res.status(400).send(response);
    }

    //Check Owner
    const isOwner = await Book.findOne({
      _id: bookID,
      owner: req.user._id,
    });
    if (isOwner) {
      const response = {
        status: 403,
        message: "Can't rate your own book.",
      };
      return res.status(403).send(response);
    }

    //Check Rate Duplicate
    const isDuplicate = await Rating.findOne({
      userRatingID: req.user._id,
      bookRatingID: bookID,
    });
    if (isDuplicate) {
      const response = {
        status: 403,
        message: "You have rated this book.",
      };
      return res.status(403).send(response);
    }

    //CreateRate
    const rate = new Rating({
      userRatingID: req.user._id,
      bookRatingID: bookID,
      amount: score,
    });
    const createBook = await rate.save();
    if (!createBook) {
      const response = {
        status: 500,
        message: "error",
      };
      return res.status(500).send(response);
    }

    //Load all RatingData before update
    const ObjectId = mongoose.Types.ObjectId;
    const ratingData = await Rating.aggregate([
      { $match: { bookRatingID: ObjectId(bookID) } },
      {
        $group: {
          _id: bookID,
          numRate: {
            $sum: 1,
          },
          sumScore: {
            $sum: "$amount",
          },
        },
      },
    ]);
    if (!ratingData) {
      const response = {
        status: 500,
        message: "error",
      };
      return res.status(500).send(response);
    }
    req.ratingData = ratingData[0];
    next();
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    return res.status(500).send(response);
  }
}

module.exports = { ratingCreate };
