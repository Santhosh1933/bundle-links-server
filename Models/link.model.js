const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  RouteId: { type: mongoose.Types.ObjectId, required: true },
  userRouteName: { type: String, required: true },
  active: { type: Boolean, default: true },
  linksArray: {
    type: [
      {
        title: { type: String, unique: true },
        link: String,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("links", linkSchema);
