const Book = require("../model/Book");
const { bookValidation } = require("../helper/validation");

async function addBook(req, res) {
  //Validation
  const { error } = bookValidation(req.body);
  if (error) {
    const err = error.details[0].message;
    const response = {
      status: 400,
      message: err,
    };
    return res.status(400).send(response);
  }
  //Create book from BookSchema
  const book = new Book({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discout: req.body.discout,
    owner: req.user._id,
    rating: 0,
  });

  //Add Book
  try {
    const createBook = await book.save();
    const response = {
      status: 201,
      message: "Book created!!",
      data: createBook,
    };
    res.send(response);
  } catch (err) {
    const response = {
      status: 500,
      message: "error",
    };
    res.status(500).send(response);
  }
}

function allBook(req, res) {
  try {
    Book.find({ visible: true }, function (err, books) {
      var allBook = {};
      books.forEach(function (book, index) {
        allBook[index] = book;
      });

      const response = {
        status: 200,
        message: "Successfully!!",
        data: allBook,
      };

      res.send(response);
    });
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    res.status(500).send(response);
  }
}

function showBook(req, res) {
  try {
    Book.findOne({ _id: req.params.id, visible: true }, function (err, book) {
      if (err) {
        const response = {
          status: 400,
          message: "Invalid",
        };
        return res.status(400).send(response);
      }
      const response = {
        status: 200,
        message: "Successfully!!",
        data: book,
      };
      res.send(response);
    });
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    return res.status(500).send(response);
  }
}

async function updateBook(req, res) {
  //Check Book's owner
  try {
    const isOwner = await Book.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!isOwner) {
      const response = {
        status: 403,
        message: "You aren't the owner.",
      };
      return res.status(403).send(response);
    }
    const dataUpdate = {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      },
    };
    Book.updateOne({ _id: req.params.id }, dataUpdate, function (err, result) {
      if (err) {
        const response = {
          status: 400,
          message: "Invalid",
        };
        return res.status(400).send(response);
      }
      const response = {
        status: 200,
        message: "Update Success!!",
      };
      return res.send(response);
    });
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    return res.status(500).send(response);
  }
}

async function updateVisible(req, res) {
  try {
    //Check Book's owner
    const isOwner = await Book.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!isOwner) {
      const response = {
        status: 403,
        message: "You aren't the owner.",
      };
      return res.status(403).send(response);
    }

    const dataUpdate = {};
    const visibleNow = await Book.findOne({
      _id: req.params.id,
    });
    if (visibleNow.visible) {
      dataUpdate["$set"] = { visible: false };
    } else {
      dataUpdate["$set"] = { visible: true };
    }

    Book.updateOne({ _id: req.params.id }, dataUpdate, function (err, result) {
      if (err) {
        const response = {
          status: 400,
          message: "Invalid",
        };
        return res.status(400).send(response);
      }
      const response = {
        status: 200,
        message: "Update Success!! now visible is " + !visibleNow.visible,
      };
      return res.send(response);
    });
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    return res.status(500).send(response);
  }
}

async function deleteBook(req, res) {
  try {
    //Check Book's owner
    const isOwner = await Book.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!isOwner) {
      const response = {
        status: 403,
        message: "You aren't the owner.",
      };
      return res.status(403).send(response);
    }

    Book.findOneAndRemove({ _id: req.params.id }, function (err, result) {
      if (err) {
        const response = {
          status: 500,
          message: "error",
        };
        return res.status(500).send(response);
      }
      const response = {
        status: 200,
        message: "Delete Successfully!!",
      };
      return res.send(response);
    });
  } catch {
    const response = {
      status: 500,
      message: "error",
    };
    return res.status(500).send(response);
  }
}

function updateScore(req, res) {
  console.log(req.ratingData);
  const newScore = req.ratingData.sumScore / req.ratingData.numRate;
  const dataUpdate = {
    $set: {
      rating: newScore.toFixed(2),
    },
  };
  Book.updateOne(
    { _id: req.ratingData._id },
    dataUpdate,
    function (err, result) {
      if (err) {
        const response = {
          status: 500,
          message: "error",
        };
        return res.status(500).send(response);
      }
      const response = {
        status: 200,
        message: "Complete rating!",
      };
      return res.send(response);
    }
  );
}

module.exports = {
  addBook,
  allBook,
  showBook,
  updateBook,
  updateVisible,
  deleteBook,
  updateScore,
};
