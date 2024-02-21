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
module.exports = { handleCreateMovie, handlegetMovies };
