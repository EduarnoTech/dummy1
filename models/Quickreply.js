const mongoose = require("mongoose");

const QuickreplySchema = new mongoose.Schema(
  {
    shortcut: {
      type: String
    },
    message: {
      type: String
    }
  }
);

module.exports = mongoose.model("Quickreply", QuickreplySchema);
