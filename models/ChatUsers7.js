const mongoose = require("mongoose");

const ChatUserSchema = new mongoose.Schema(
  {
    agent: {
      type: String
    },
    status: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatUsers7", ChatUserSchema);
