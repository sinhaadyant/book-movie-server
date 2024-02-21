require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const movieRouter = require("./routes/movie");
const cors = require("cors");
const { authenticationMiddlware } = require("./middlewares/auth");

//Mongoose Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("Error connection", error);
  });
//Middlewares
app.use(express.json());
app.use(cors());

app.use(authenticationMiddlware());

app.get("/", (req, res) => res.json({ status: "Success" }));

app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/movies`, movieRouter);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
