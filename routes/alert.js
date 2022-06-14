const router = require("express").Router();
const Alert = require("../models/Alert");
// const User = require("../models/User");

//new msg alert store
router.post("/", async (req, res) => {
  const newAlert = new Alert(req.body);
  try {
    const savedAlert = await newAlert.save();
    res.status(200).json(savedAlert);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a alert
router.put("/updateAlert/:id", async (req, res) => {
  try {
    const alrt = await Alert.findOne({ id: req.params.id });
    await alrt.update({ id: req.params.id, status: req.body.status });
    const updated = await Alert.findOne({ id: req.params.id });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get new msg alerts

router.get("/:wa_id", async (req, res) => {
  try {
    const alertMsg = await Alert.find({ wa_id: req.params.wa_id });
    res.status(200).json(alertMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
