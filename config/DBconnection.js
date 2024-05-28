const mongoose = require("mongoose");
const Movie = require("../models/moviesModel"); 
const fs = require("fs").promises;

//connecting database
mongoose
  .connect(process.env.LOCAL_DB_STR, {
    useNewUrlParser: true,
  })
  .catch((error) => {
    console.log(error);
  });

// Function to add movies to the database
async function addMovies() {
  try {
    const data = await fs.readFile(__dirname+"/movies.json", "utf8");

    const movies = JSON.parse(data);
    await Movie.insertMany(movies);
    console.log("Movies added successfully!");
  } catch (error) {
    
    console.error("Error adding movies:", error);
  } 
}

// Call the function to add movies
//addMovies();

module.exports = mongoose;
