const Movie = require("../models/moviesModel");
const fs = require("fs");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const movies = await Movie.find()
    .limit(parseInt(req.query.limit) || 10)
    .skip(parseInt(req.query.offset) || 0);
  res.status(200).json({
    status: "success",
    data: movies,
  });
});

exports.createMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = asyncErrorHandler(async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { movie: updatedMovie },
  });
});

exports.deleteMovie = asyncErrorHandler(async (req, res) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//this function is responsible for getting movies by genre then writing the result to a file and sending the result to the client
//can you manipulate aggregation to get the count of movies in each genre (there are formated example in result.txt in the log folder)
// bouns: is there a better way to optimize performance

exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
  const movies = await Movie.aggregate([
    {
      $unwind: "$genres",
    },
    {
      $group: {
        _id: "$genres",
        movies: { $push: "$name" },
        movieCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        genre: "$_id",
        movies: 1,
        movieCount: 1,
      },
    },
  ]);

  // Stream data to the result.txt file
  const writeStream = fs.createWriteStream("./log/result.txt", {
    flags: "a",
  });
  movies.forEach((movie) => {
    writeStream.write(`${JSON.stringify(movie, null, 2)}\n`);
  });
  writeStream.end();

  // Send the formatted response to the client
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: movies.map((movie) => ({
      genre: movie.genre,
      movieCount: movie.movieCount,
      movies: movie.movies,
    })),
  });
});
