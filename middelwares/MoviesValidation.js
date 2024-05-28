const { body, validationResult, param } = require("express-validator");
const mongoose = require("mongoose");
const Movie = require("../models/moviesModel");

exports.validationCreat = async (req, res, next) => {
  const validations = [
    // Validate movie name
    body("name")
      .notEmpty()
      .withMessage("Movie name is required")
      .isLength({ min: 4, max: 100 })
      .withMessage("Movie name must be between 4 and 100 characters"),

    // Validate genres (must be one of the allowed values)
    body("genres")
      .isArray({ min: 1 })
      .withMessage("At least one genre is required")
      .custom((genres) => {
        const allowedGenres = [
          "War",
          "Action",
          "Adventure",
          "Sci-Fi",
          "Thriller",
          "Crime",
          "Drama",
          "Comedy",
          "Romance",
          "Biography",
        ];
        return genres.every((genre) => allowedGenres.includes(genre));
      })
      .withMessage("Invalid genre"),

    // Validate description
    body("description").notEmpty().withMessage("Description is required"),

    // Validate duration (must be a positive number)
    body("duration")
      .isNumeric()
      .withMessage("Duration must be a number")
      .custom((value) => value > 0)
      .withMessage("Duration must be greater than 0"),

    // Validate ratings (between 1 and 10)
    body("ratings")
      .isNumeric()
      .withMessage("Ratings must be a number")
      .custom((value) => value >= 1 && value <= 10)
      .withMessage("Ratings should be between 1 and 10"),

    // Validate release year (must be a positive integer)
    body("releaseYear")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Invalid release year"),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        path: error.param,
        msg: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next();
  });
};

exports.validationUpdate = async (req, res, next) => {
  const validations = [
    // Validate movie name
    check("name")
      .optional()
      .isLength({ min: 4, max: 100 })
      .withMessage("Movie name must be between 4 and 100 characters"),

    body("genres")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one genre is required")
      .custom((genres) => {
        const allowedGenres = [
          "War",
          "Action",
          "Adventure",
          "Sci-Fi",
          "Thriller",
          "Crime",
          "Drama",
          "Comedy",
          "Romance",
          "Biography",
        ];
        return genres.every((genre) => allowedGenres.includes(genre));
      })
      .withMessage("Invalid genre"),

    body("duration")
      .optional()
      .isNumeric()
      .withMessage("Duration must be a number")
      .custom((value) => value > 0)
      .withMessage("Duration must be greater than 0"),

    body("ratings")
      .optional()
      .isNumeric()
      .withMessage("Ratings must be a number")
      .custom((value) => value >= 1 && value <= 10)
      .withMessage("Ratings should be between 1 and 10"),

    body("releaseYear")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Invalid release year"),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        path: error.param,
        msg: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next();
  });
};
exports.validationMovieNameDuplicate = async (req, res, next) => {
  if (req.body.name) {
    const movie = await Movie.findOne({ name: req.body.name });
    if (movie) {
      const error = new Error("Movie with that name already exists");
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
};

exports.validationMovieID = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const err = new Error("Invalid movie ID");
        err.statusCode = 400;
        return next(err);
    }
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    const err = new Error("Movie with that ID is not found!");
    err.statusCode = 404;
    return next(err);
  }
  next();
};
