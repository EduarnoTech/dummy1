const mongoose = require('mongoose');

const Detailed_tutorForm1 = new mongoose.Schema({
  tutor_id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    default: null,
  },
  highest_degree: {
    type: String,
    default: null,
  },

  university: {
    type: String,
    default: null,
  },
  skills: {
    type: Array,
    default: null,
  },
  // other_skill,
  best_subjects: {
    type: Array,
    default: null,
  },
  software_skills: {
    type: Array,
    default: null,
  },
  country_and_code: {
    type: String,
    default: null,
  },
  whatsapp_no: {
    type: String,
    default: null,
  },
  phone_no: {
    type: String,
    default: null,
  },
  highestDegreeFile: {
    type: Array,
    default: null,
  },
  username: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  pan_name: {
    type: String,
    default: null,
  },
  pan_number: {
    type: String,
    default: null,
  },
  pan_file: {
    type: Array,
    default: null,
  },
  account_name: {
    type: String,
    default: null,
  },
  account_number: {
    type: String,
    default: null,
  },
  ifsc: {
    type: String,
    default: null,
  },
  UPI: {
    type: String,
    default: null,
  },
  fundId_bank: {
    type: String,
    default: null,
  },
  fundId_upi: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model('Detailed_tutorForm1', Detailed_tutorForm1);
