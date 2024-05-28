//config express
const express = require("express");
const app = express();
//importing routes
const moviesRoutes = require("./routes/moviesRoutes");

// config env file
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
//import DB connection
require("./config/DBconnection");
app.use(express.json());
app.use("/movies", moviesRoutes);

app.all("*", (req, res, next) => {
   const err = new Error(`can't find  ${req.originalUrl} on the server`);
   err.status = "fail";
   err.statusCode = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 400).json({
    message: error.message || "something went wrong",
  });
});

//creating server
app.listen(process.env.PORT || 3000, () => {
  console.log("server has started");
});
