const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const alertRoute = require("./routes/alert");
const conversationRoute = require("./routes/conversations");
const conversationRoute2 = require("./routes/conversations2");
const conversationRoute3 = require("./routes/conversations3");
const conversationRoute4 = require("./routes/conversations4");
const conversationRoute5 = require("./routes/conversations5");
const conversationRoute6 = require("./routes/conversations6");
const conversationRoute7 = require("./routes/conversations7");
const messageRoute = require("./routes/messages");
const messageRoute2 = require("./routes/messages2");
const messageRoute3 = require("./routes/messages3");
const messageRoute4 = require("./routes/messages4");
const messageRoute5 = require("./routes/messages5");
const messageRoute6 = require("./routes/messages6");
const messageRoute7 = require("./routes/messages7");
const quickreplyRoute = require("./routes/quickreply");
const tutorRoute = require("./routes/tutor");
const sessionRoute = require("./routes/sessions");
const sessionRoute2 = require("./routes/sessions2");
const sessionRoute3 = require("./routes/sessions3");
const sessionRoute4 = require("./routes/sessions4");
const sessionRoute5 = require("./routes/sessions5");
const sessionRoute6 = require("./routes/sessions6");
const sessionRoute7 = require("./routes/sessions7");
const paymentRoute = require("./routes/payment");
const paymentRoute2 = require("./routes/payment2");
const paymentRoute3 = require("./routes/payment3");
const paymentRoute4 = require("./routes/payment4");
const paymentRoute5 = require("./routes/payment5");
const paymentRoute6 = require("./routes/payment6");
const paymentRoute7 = require("./routes/payment7");
const tutorWebRoute = require("./routes/tutorWeb");
const agentRoute = require("./routes/agents");
const agentRoute2 = require("./routes/agents2");
const agentRoute3 = require("./routes/agents3");
const agentRoute4 = require("./routes/agents4");
const agentRoute5 = require("./routes/agents5");
const agentRoute6 = require("./routes/agents6");
const agentRoute7 = require("./routes/agents7");
const router = express.Router();
const path = require("path");
const cors = require('cors');

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors());

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
app.use("/",(req,res)=>{
  res.send("hare krsna")
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/alerts", alertRoute);
app.use("/d1/api/conversations", conversationRoute);
app.use("/d2/api/conversations", conversationRoute2);
app.use("/d3/api/conversations", conversationRoute3);
app.use("/d4/api/conversations", conversationRoute4);
app.use("/d5/api/conversations", conversationRoute5);
app.use("/d6/api/conversations", conversationRoute6);
app.use("/d7/api/conversations", conversationRoute7);
app.use("/d1/api/messages", messageRoute);
app.use("/d2/api/messages", messageRoute2);
app.use("/d3/api/messages", messageRoute3);
app.use("/d4/api/messages", messageRoute4);
app.use("/d5/api/messages", messageRoute5);
app.use("/d6/api/messages", messageRoute6);
app.use("/d7/api/messages", messageRoute7);
app.use("/api/quickreply", quickreplyRoute);
app.use("/api/tutor", tutorRoute);
app.use("/d1/api/sessions", sessionRoute);
app.use("/d2/api/sessions", sessionRoute2);
app.use("/d3/api/sessions", sessionRoute3);
app.use("/d4/api/sessions", sessionRoute4);
app.use("/d5/api/sessions", sessionRoute5);
app.use("/d6/api/sessions", sessionRoute6);
app.use("/d7/api/sessions", sessionRoute7);
app.use("/d1/api/payments", paymentRoute);
app.use("/d2/api/payments", paymentRoute2);
app.use("/d3/api/payments", paymentRoute3);
app.use("/d4/api/payments", paymentRoute4);
app.use("/d5/api/payments", paymentRoute5);
app.use("/d6/api/payments", paymentRoute6);
app.use("/d7/api/payments", paymentRoute7);
app.use("/api/tutorWeb", tutorWebRoute);
app.use("/d1/api/agent", agentRoute);
app.use("/d2/api/agent", agentRoute2);
app.use("/d3/api/agent", agentRoute3);
app.use("/d4/api/agent", agentRoute4);
app.use("/d5/api/agent", agentRoute5);
app.use("/d6/api/agent", agentRoute6);
app.use("/d7/api/agent", agentRoute7);

const PORT = 8080
app.listen(PORT, () => {
  console.log("Backend server is running!", PORT);
});
