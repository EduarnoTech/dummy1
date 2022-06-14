const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    wa_id: {
      type: String,
      unique: true,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    countryCode: {
      type: String,
      default: null
    },
    uid: {
      type: String,
      unique: true,
      default: null
    },
    source: {
      type: Object,
      default: null
    },
    contactStatus: {
      type: String,
      default: null
    },
    photo: {
      type: Object,
      default: null
    },
    timestamp: {
      type: String,
      default: null
    },
    tags: {
      type: String,
      default: ''
    },
    pinContact: {
      type: Boolean,
      default: false
    },
    members: {
      type: Array,
      default: null
    },
    newMsgCount: {
      type: Number,
      default: 0
    },
    markAsUnread: {
      type: Boolean,
      default: false
    },
    agent: {
      type: String,
      // default: 'Admin'
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversations5", ConversationSchema);
