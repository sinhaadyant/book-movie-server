const express = require("express");

const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");

const theaterController = require("../controller/theater");
router.get("/", theaterController.handleGetAllTheater);
router.get("/geyById/:id", theaterController.handleGetTheaterById);
router.post(
  "/",
  ensureAuthenticated({ allowedRoles: ["admin"] }),
  theaterController.handleCreateTheater
);
router.put("/:id");
router.delete("/:id");

module.exports = router;
