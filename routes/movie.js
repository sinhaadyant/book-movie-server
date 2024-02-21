const express = require("express");
const router = express.Router();
const controller = require("../controller/movie");
const { ensureAuthenticated } = require("../middlewares/auth");
router.get("/", controller.handlegetMovies);
router.post(
  "/",
  ensureAuthenticated({ allowedRoles: ["admin"] }),
  controller.handleCreateMovie
);
router.put("/:id");
router.delete(
  "/:id",
  ensureAuthenticated({ allowedRoles: ["admin"] }),
  controller.handledeleteMovieById
);

module.exports = router;
