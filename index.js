const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//connect DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Database connected")
);
//Inport Route
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const ratingRoute = require("./routes/rating");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Route Middlewarecls
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/rating", ratingRoute);

app.listen(3000, () => console.log("Server is running on port 3000"));
