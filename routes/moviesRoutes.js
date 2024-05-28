const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/moviesController");
const moviesValidation = require("../middelwares/MoviesValidation");

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(
    moviesValidation.validationMovieNameDuplicate,
    moviesValidation.validationCreat,
    moviesController.createMovie
  );

router
  .route("/movie/:id")
  .get(moviesValidation.validationMovieID, moviesController.getMovie)
  .patch(
    moviesValidation.validationMovieID,
    moviesValidation.validationMovieNameDuplicate,
    moviesValidation.validationUpdate,
    moviesController.updateMovie
  )
  .delete(moviesValidation.validationMovieID, moviesController.deleteMovie);
  router.route("/genre").get(moviesController.getMoviesByGenre);

module.exports = router;
