const mongoose = require("mongoose");
 
const TutorSchema = new mongoose.Schema(
    {
        tutor_id:{
            type: String,
            unique: true
          },
        name: {
            type: String
        },
        wa_name: {
            type: String
        },
        highest_degree: {
            type: String
        },
        academic_info: {
            type: Array
        },
        Bank:{
            acc_no:String,
            ifsc_code:String,
            upi_id:String
        },
        pan: {
            type: String
        },
        contact_id:{
            type: String,
            default: ''
          },
        fund_upi_id:{
            type: String,
            default: ''
          },
        fund_bank_id:{
            type: String,
            default: ''
          },
        pout_id: {
            type: String,
            default: ''
        },
        dept: {
            type: String
        },
        subjects: {
            type: Array
        },
        software_skills:{
            type: Array
        },
        rating: {
            type: String
        },
        rating_and_reviews: {
            type: Array
        },
        wa_id:{
            type: String,
            unique: true
          },
        email:{
            type: String,
            unique: true
          },
        type: {
            type: String
        },
        tutor_status: {
            type: String
        },
        sessions_done: {
            type: Array
        },
        sessions_assigned: {
            type: Array
        },
        tags: {
            type: Array
        },
        writer: {
            type: Boolean
        }
      },
      {timestamps: true}
);
 
module.exports = mongoose.model("Tutor", TutorSchema);