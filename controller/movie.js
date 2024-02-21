const { validateCreateMoviePayload } = require("../lib/movie");
const Movie = require("../models/movie");

const handleCreateMovie = async (req, res) => {
  const validationResult = validateCreateMoviePayload(req.body);
  if (validationResult.error) {
    res.status(400).json({ status: "error", error: validationResult.error });
  }

  try {
    const { title, description, language } = validationResult.data;
    const movie = await Movie.create({ title, description, language });

    return res.json({ status: "success", id: movie?._id });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};
const handlegetMovies = async (req, res) => {
  const page = req?.query?.page ? parseInt(req?.query?.page) : 1;
  const LIMIT = req?.query?.limit ? parseInt(req?.query?.limit) : 2;
  const skip = (page - 1) * LIMIT;
  const movies = await Movie.find({}).skip(skip).limit(LIMIT);
  return res.json({ status: "success", data: movies, page: page });
};
const handledeleteMovieById = async (req, res) => {
  if (req?.params?.id) {
    const id = req.params.id;
    try {
      const deleteMovie = await Movie.findByIdAndDelete(id);
      if (deleteMovie) {
        return res.json({
          status: "success",
          message: "Movie Deleted Successfully",
          deleteMovie,
        });
      } else {
        return res
          .status(500)
          .json({ status: "error", error: `Movie with ${id} not exists` });
      }
    } catch (error) {
      return res.status(500).json({ status: "error", error: error });
    }
  }
  return res.status(500).json({ status: "error", error: "InValid Request" });
};

const handleFindMovieById = async (req, res) => {
  if (req?.params?.id) {
    const id = req?.params?.id;

    const movieDetail = await Movie.findById(id);
    if (movieDetail) {
      res.json({ status: "success", data: movieDetail });
    } else {
      res
        .status(400)
        .json({ status: "error", error: `Movie with ${id} not exists` });
    }
  }
  return res.status(500).json({ status: "error", error: "InValid Request" });
};
module.exports = {
  handleCreateMovie,
  handlegetMovies,
  handledeleteMovieById,
  handleFindMovieById,
};
