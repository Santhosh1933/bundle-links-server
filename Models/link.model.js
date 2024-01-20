const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  RouteId: { type: mongoose.Types.ObjectId, required: true },
  userRouteName: { type: String, required: true },
  active: { type: Boolean, default: true },
  profile: String,
  linksArray: {
    type: [
      {
        title: String,
        link: String,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("links", linkSchema);
