const mongoose = require("mongoose");

const userRouteSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  userRouteName: { type: String, required: true },
  profile: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("route", userRouteSchema);
