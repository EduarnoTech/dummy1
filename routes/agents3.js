const router = require('express').Router();
const Agent = require('../models/Agents3');
const axios = require('axios');

//get agent status
router.get('/getAgentStatus/:agent', async (req, res) => {
  try {
    const agentData = await Agent.find({agent: req.params.agent});
    res.status(200).json({status: agentData[0].status});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get active agents list
router.get('/getActiveAgents', async (req, res) => {
  try {
    const agentData = await Agent.find({status: 'active'});
    res.status(200).json(agentData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

//active/inactive agent
router.put('/updateAgentStatus/:agent', async (req, res) => {
  try {
    const agentData = await Agent.findOne({agent: req.params.agent});
    const dbReturn = await agentData.update({
      status: req.body.status,
    });
    res.status(200).json(dbReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;