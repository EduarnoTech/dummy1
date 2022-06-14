const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      default: null
    },
    id: {
      type: String,
      unique: true,
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
    replyButton: {
      type: String,
      default: null
    },
    context: {
      type: Object,
      default: null
    },
    templateName: {
      type: String
    },
    templateText: {
      type: String
    },
    noteText: {
      type: String
    },
    button: {
      type: Array
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

module.exports = mongoose.model("Messages2", MessageSchema);
