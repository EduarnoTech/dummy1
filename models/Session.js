const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    session_id: {
        type: String,
        unique: true,
        default: null
    },
    client_id: {
        type: String,
    },
    client_waId: {
        type: String,
    },
    client_name: {
        type: String,
    },
    client_files: {
        type: Array
    },
    client_comments: {
        type: String
    },
    agents_name: {
        type: Array
    },
    device_id: {
        type: String
    },
    branch: {
        type: String
    },
    subject: {
        type: String
    },
    deadline: {
        type: String
    },
    tutor_deadline: {
        type: String
    },
    client_time: {
        type: String
    },
    duration: {
        type: String
    },
    tutor_duration: {
        type: String
    },
    assigned_tutors: {
        type: Array
    },
    notified_tutors: {
        type: Array
    },
    tutor_interested: {
        type: Array
    },
    client_amount: {
        type: String
    },
    tutor_dealt_amount: {
        type: String
    },
    work_status: {
        type: String,
        default: 'New Task'
    },
    amount_received: {
        type: Number
    },
    amount_remaining: {
        type: Number
    },
    currency: {
        type: String
    },
    paypal_url: {
        type: String
    },
    show_paypal_url: {
        type: Boolean
    },
    rating_client: {
        type: String
    },
    session_status: {
        type: String
    },
    client_payment_status: {
        type: String
    },
    agent_comments: {
        type: Array
    },
    agent_comments_new: {
        type: Array
    },
    type: {
        type: String
    },
    tutor_pay_total:{
        type: String
    },
    active: {
        type: Boolean
    },
    filelink: {
        type: Array
    },
    quesFolderLink:{
        type:String
    },
    folderlink: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    plink_id: {
        type: String
    },
    va_id: {
        type: String
    },
    payment_info: {
        type: Array
    },
    payment_status: {
        type: String,
        default: 'not_paid'
    },
    refund_status: {
        type: String
    },
    tutor_payment_status: {
        type: String,
        default: 'not_paid'
    },
    session_agent: {
        type: String
    },
    university: {
        type: String,
        default: null,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
