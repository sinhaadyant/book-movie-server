const { Schema } = require("mongoose");

const theatreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      lon: { type: String, required: true },
      lat: { type: String, required: true },
      address: { type: String, required: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Theater = model("theatre", theatreSchema);
module.exports = Theater;
