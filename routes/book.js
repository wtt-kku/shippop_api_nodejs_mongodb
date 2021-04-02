const express = require("express");
const router = express.Router();
const BookController = require("../controller/BookController");
const auth = require("./auth");

router.get("/", BookController.allBook);
router.get("/:id", BookController.showBook);
router.post("/", auth, BookController.addBook);
router.put("/:id", auth, BookController.updateBook);
router.put("/editvisible/:id", auth, BookController.updateVisible);
router.delete("/:id", auth, BookController.deleteBook);

module.exports = router;
