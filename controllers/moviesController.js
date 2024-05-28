const Movie = require("../models/moviesModel");
const  fs = require("fs");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const movies = await Movie.find()
    .limit(parseInt(req.query.limit) || 10)
    .skip(parseInt(req.query.offset) || 0);
  res.status(200).json({
    status: "success",
    data:  movies ,
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
//can you manipulate aggregation to get the count of movies in each genre
// is there a better way to optimize performance 

exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
  const movies = await Movie.aggregate([
    { $unwind: "$genre" },
    {
      $group: {
        _id: "$genre",
        movies: { $push: "$name" },
      },
    },  
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
  ]);

  fs.writeFileSync("./log/result.txt", JSON.stringify(movies), { flag: "a" });

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });
});