const router = require('express').Router();
const Conversation = require('../models/Conversation');
const axios = require('axios');
const ChatUser = require('../models/ChatUser');

//new conv
router.post('/', async (req, res) => {
  const newConversation = new Conversation(req.body);

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update uid
router.put('/customer/:wa_id', async (req, res) => {
  try {
    const _msg = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await _msg.update({
      wa_id: req.params.wa_id,
      uid: req.body.uid,
    });
    res.status(200).json(_msg);
  } catch (err) {
    res.status(500).json(err);
  }
});

// contact validation
router.post('/contactValidation', async (req, res) => {
  const url = `https://waba.360dialog.io/v1/contacts`;
  let payload = {
    blocking: 'wait',
    contacts: [req.body.wa_id],
    force_check: true,
  }
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'D360-API-KEY': 'JMjJNtiGmSiet1O9OXJOExGhAK'
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json(err.response);
  }
});


//add contact manually
router.post('/addContact', async (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/contacts',
    headers: {
      'D360-API-KEY': 'JMjJNtiGmSiet1O9OXJOExGhAK',
    },
    data: {
      blocking: 'wait',
      contacts: [req.body.wa_id],
      force_check: true,
    },
  })
    .then(async (resp) => {
      if (resp.data.contacts[0].status == 'valid') {
        let lastObj = await Conversation.find().sort({ uid: -1 }).limit(1); // get last object of the collection
        const newContact = new Conversation({
          name: req.body.name,
          wa_id: resp.data.contacts[0].wa_id,
          phone: resp.data.contacts[0].wa_id,
          uid: +lastObj[0].uid + 1 + '',
          agent: 'Admin',
          timestamp: Math.floor(new Date().getTime() / 1000.0)
        });
        try {
          const savedContact = await newContact.save();
          res.status(200).json(savedContact);
        } catch (err) {
          res.status(500).json(err);
        }
      }
      else {
        res.status(200).json('invalid contact');
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json('Something went wrong!');
      console.log(error);
    });
});

//get all contacts without pagination
router.get('/getContacts', async (req, res) => {

  try {
    const conversation = await Conversation.find();
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//find contact by wa_id
router.get('/findContact/:wa_id', async (req, res) => {

  try {
    const conversation = await Conversation.find({ wa_id: req.params.wa_id });
    let lastObj = await Conversation.find().sort({ uid: -1 }).limit(1); // get last object of the collection
    res.status(200).json({status: 'success', count: conversation.length, lastObj: lastObj[0], result: conversation});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get contacts of an agent
router.get('/getContacts/search/:agent', async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
 
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    const conversation = await Conversation.find({ agent: req.params.agent });
    
    let pinnedChat = conversation.filter((el) => el.pinContact === true);
    let unPinnedChat = conversation.filter((el) => el.pinContact === false)
    ?.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    let finalList = [...pinnedChat, ...unPinnedChat];
    
    const resultContacts = finalList.slice(startIndex, endIndex);
    res.status(200).json({length: conversation.length, result: resultContacts});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get contacts by search
router.get("/getContacts/search/:agent/:contactsearch", async (req,res) => {
  let page = req.query.page;
  let limit = req.query.limit;
 
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  const agg = [
    {
      $search: {
        text: {
          query: req.params.contactsearch,
          path: ["name", "wa_id", "tags", "uid"],
          fuzzy:{}
        },
      },
    }
 
  ];
  try {
    let contacts = await Conversation.aggregate(agg);
    let filtered = contacts.filter((fl) => fl.agent == req.params.agent);
    const resultContacts = filtered.slice(startIndex, endIndex);
    res.status(200).json({length: filtered.length, result: resultContacts});
  } catch (err) {
    req.status(500).json(err);
  }
     
 
 
});

//update contacts
router.put('/:wa_id', async (req, res) => {
  try {
    const msg = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await msg.update({
      wa_id: req.params.wa_id,
      newMsgCount: req.body.newMsgCount,
      timestamp: req.body.timestamp,
    });
    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update contacts lebels
router.put('/chatLabel/:wa_id', async (req, res) => {
  try {
    const msg_ = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await msg_.update({
      wa_id: req.params.wa_id,
      tags: req.body.tags,
    });
    res.status(200).json(msg_);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update contacts pinning
router.put('/pinChat/:wa_id', async (req, res) => {
  try {
    const _msg = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await _msg.update({
      wa_id: req.params.wa_id,
      pinContact: req.body.pinContact,
    });
    res.status(200).json(_msg);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update mark as unread status
router.put('/markChat/:wa_id', async (req, res) => {
  try {
    const chat = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await chat.update({
      wa_id: req.params.wa_id,
      markAsUnread: req.body.markAsUnread,
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update coments in converstation
router.put('/stickComments/:wa_id', async (req, res) => {
  try {
    const chat = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await chat.update({
      wa_id: req.params.wa_id,
      comments: req.body.comments,
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log({err})
    res.status(500).json(err);
    
  }
});

//fetch stick comments
router.get('/fetchStickComments/:wa_id', async (req, res) => {
  try {
    const chat = await Conversation.findOne({ wa_id: req.params.wa_id });
   
    res.status(200).json(chat.comments);
  } catch (err) {
    console.log({err})
    res.status(500).json(err);
  }
});

//assign agent to a chat
router.put('/chatAgent/:wa_id', async (req, res) => {
  try {
    const contact = await Conversation.findOne({ wa_id: req.params.wa_id });
    const dbReturn = await contact.update({
      wa_id: req.params.wa_id,
      agent: req.body.agent,
    });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// agent status change
router.post('/agentStatus/:agent', async (req, res) => {
  try {
    const agent = await ChatUser.findOne({ agent: req.params.agent });
    const dbReturn = await agent.update({
      agent: req.params.agent,
      status: req.body.status
    });
    res.status(200).json(dbReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
