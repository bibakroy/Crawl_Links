const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let LinkDataSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
});

const GetLinksSchema = new Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    linksData: {
      type: [LinkDataSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GetLinks", GetLinksSchema);
