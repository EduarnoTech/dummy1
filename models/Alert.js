const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      default: null,
      require: true,
    },
    id: {
      type: String,
      default: null,
      require: true,
    },
    name: {
      type: String,
      default: null,
      require: true,
    },
    from: {
      type: String,
      default: null
    },
    wa_id: {
      type: String,
      default: null,
      require: true,
    },
    text: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: ''
    },
    timestamp: {
      type: String
    },
    operatorName: {
      type: String,
      default: null
    },
    isOwner: {
      type: Boolean,
      default: null
    },
    status: {
      type: String,
      default: null
    },
    ticketId: {
      type: String,
      default: null
    },
    eventType: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
