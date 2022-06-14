const mongoose = require('mongoose');

const TutorRegInfoSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },

  branch: {
    type: Array,
    default: null,
  },
  highest_degree: {
    type: Array,
    default: null,
  },

  university: {
    type: Array,
    default: null,
  },
  skills: {
    type: Array,
    default: null,
  },
  software_skills: {
    type: Array,
    default: null,
  },
});
module.exports = mongoose.model('TutorRegInfos7', TutorRegInfoSchema);
