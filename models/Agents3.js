const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema(
  {
    agent: {
      type: String,
    },
    status: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agents3", AgentSchema);