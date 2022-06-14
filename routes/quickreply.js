const router = require('express').Router();
const Quickreply = require('../models/Quickreply');


// quick reply message
router.get('/', async (req, res) => {
    try {
        const message = await Quickreply.find();
        res.status(200).json(message);
      } catch (err) {
        res.status(500).json(err);
      }
})

//add new quick replies
// router.post('/addQuickreply', async (req, res) => {
//   const newQuickReply = new Quickreply(req.body);
//   try {
//     const savedMessage = await newQuickReply.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err)
//   }
// })

module.exports = router;
