const Theater = require("../models/theatre");
const { validateCreateTheaterPayload } = require("../lib/theater");
const z = require("zod");
const handleCreateTheater = async (req, res) => {
  const validationResult = validateCreateTheaterPayload(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ status: "error", error: validationResult.error });
  }

  try {
    const {
      name,
      location: { lon, lat, address },
    } = validationResult.data;
    const createTheater = await Theater.create({
      name,
      location: { lon, lat, address },
    });
    return res.json({ status: "success", data: createTheater });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};

const handleGetAllTheater = async (req, res) => {
  const page = req?.query?.page ? parseInt(req?.query?.page) : 1;
  const limit = req?.query?.limit ? parseInt(req?.query?.limit) : 2;
  const skip = (page - 1) * limit;
  const data = await Theater.find({}).skip(skip).limit(limit);
  return res.json({ status: "success", data });
};
const handleGetTheaterById = async (req, res) => {
  if (req?.params?.id) {
    const id = req?.params?.id;
    try {
      const data = await Theater.findById(id);

      if (data) {
        res.json({ status: "success", data });
      } else {
        res.status(400).json({ status: "error", error: `Invalid Request` });
      }
    } catch (error) {
      res.status(400).json({ status: "error", error: `Invalid Request` });
    }
  }
  return res.status(500).json({ status: "error", error: `Id is Required` });
};

module.exports = {
  handleCreateTheater,
  handleGetAllTheater,
  handleGetTheaterById,
};
