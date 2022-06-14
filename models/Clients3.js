const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  client_id: {
    type: String,
    unique: true,
    default: null,
  },
  whatsapp: {
    type: String,
    default: null,
  },
  client_name: {
    type: String,
  },
  branch: {
    type: String,
  },
  email: {
    type: String,
    default: null,
  },
  university: {
    type: String,
    default: null,
  },
  semester: {
    type: String,
    default: null,
  },
  timezone: {
    type: Object,
    default: null,
  },
  socialmedia: {
    platform: String,
    username: {
      type: String,
      default: null,
    },
  },
});

module.exports = mongoose.model('Clients3', ClientSchema);
