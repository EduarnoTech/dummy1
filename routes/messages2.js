const router = require('express').Router();
const Message = require('../models/Messages2');
const axios = require('axios');
const fetch = require('node-fetch');

//add msg
router.post('/', async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//send session message
router.post('/sendSession', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      recipient_type: req.body.recipient_type,
      to: req.body.wa_id,
      type: req.body.type,
      text: {
        body: req.body.text.body,
      },
    },
  })
    .then(async (response) => {
      // msgId = response.data.messages[0].id
      const newMsg = new Message({
        conversationId: '',
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        text: req.body.text,
        type: req.body.type,
        data: req.body.data,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'message',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(response.data);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
});

//adding note b/w message
router.post('/addChatNote', async (req, res) => {
  const newMsg = new Message({
    conversationId: '',
    id: Math.floor(new Date().getTime()),
    name: req.body.name,
    from: req.body.from,
    wa_id: req.body.wa_id,
    noteText: req.body.noteText,
    timestamp: Math.floor(new Date().getTime() / 1000.0),
    operatorName: '',
    isOwner: req.body.isOwner,
    status: req.body.status,
    ticketId: '',
    eventType: 'note'
  });
  try {
    const savedMsg = await newMsg.save();
    res.status(200).json(savedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

//send template message
router.post('/sendTemplate', async (req, res) => {
  await axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'body',
            parameters:
              req.body.templateName === 'ask_session'
                ? []
                : [
                    {
                      type: 'text',
                      text: req.body.name,
                    },
                  ],
          },
        ],
      },
    },
  })
    .then(async (response) => {
      // msgId = response.data.messages[0].id
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
});

//send Media
router.post('/sendMedia', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      recipient_type: req.body.recipient_type,
      to: req.body.to,
      type: req.body.type,
      [req.body.type]: {
        id: req.body.data.id,
        caption: req.body.data.caption,
      },
    },
  })
    .then(async (resp) => {
      const nwMsg = new Message({
        conversationId: '',
        id: resp.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        type: req.body.type,
        data: req.body.data,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: '',
      });
      try {
        const svedMsg = await nwMsg.save();
        res.status(200).json(svedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});

// //fetch media
// router.get('/fetchMedia/:mediaid', async (req, res) => {
//   let mediaid = req.params.mediaid;
//   await fetch(`https://waba.360dialog.io/v1/media/${mediaid}`, {
//     method: 'get',
//     headers: {
//       'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
//     }
//   })
//   .then((res) => res.blob())
//   .then((blob) => {
//     res.status(200).json(URL.createObjectURL(blob));
//   })
//   .catch(function (error) {
//     res.status(500).json(error);
//     console.log(error);
//   });
// });

//update msg
router.put('/:id', async (req, res) => {
  try {
    const msg = await Message.findOne({ id: req.params.id });
    const mongoReturn = await msg.update({
      id: req.params.id,
      status: req.body.status,
      timestamp: req.body.timestamp,
    });
    res.status(200).json(mongoReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all msgs of a whatsappno
router.get('/:wa_id', async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const messages = await Message.find({
      wa_id: req.params.wa_id,
    });
    const startIndex =
      messages.length - limit - limit * page < 0
        ? 0
        : messages.length - limit - limit * page;
    const endIndex = messages.length - limit * page;
    const resultMessages = messages.slice(startIndex, endIndex);
    res.status(200).json(resultMessages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//find message by id
router.get('/findMsg/:id', async (req, res) => {
  try {
    const msg = await Message.find({ id: req.params.id });
    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json(err);
  }
});

//send template message to tutors
router.post('/tutorTemplate', async (req, res) => {
  await axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: 
            req.body.templateName.includes('live_session_tutor_notify') ? [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              },
              {
                type: 'text',
                text: req.body.param4,
              },
              {
                type: 'text',
                text: req.body.param5
              },
              {
                type: 'text',
                text: req.body.param6
              }
            ] :
            [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              },
              {
                type: 'text',
                text: req.body.param4,
              },
              {
                type: 'text',
                text: req.body.param6
              },
            ],
          },
          {
            type: 'button',
            index: '0',
            sub_type: 'url',
            parameters: [
              {
                type: 'text',
                text: req.body.param7,
              },
            ],
          },
        ],
      },
    },
  })
    .then(async (response) => {
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
    });
});

//send template message to clients
router.post('/clientTemplate', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: req.body.param2,
              }
            ]
          },
          {
            type: 'button',
            index: '0',
            sub_type: 'url',
            parameters: [
              {
                type: 'text',
                text: req.body.param3,
              },
            ],
          },
        ],
      },
    },
  })
    .then(async (response) => {
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});

//send template message to tutors for payment onfirmation
router.post('/tutorPaymentTemplate', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              },
              {
                type: 'text',
                text: req.body.param4,
              },
              {
                type: 'text',
                text: req.body.param5,
              },
              {
                type: 'text',
                text: req.body.param6,
              },
              {
                type: 'text',
                text: req.body.param7,
              },
              {
                type: 'text',
                text: req.body.param8,
              },
              {
                type: 'text',
                text: req.body.param9,
              }
            ]
          }
        ],
      },
    },
  })
    .then(async (response) => {
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});

//send template message to assigned tutors as confirmation
router.post('/tutorAssignTemplate', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: 
            [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              }
            ]
          },
          {
            type: 'button',
            index: '0',
            sub_type: 'url',
            parameters: [
              {
                type: 'text',
                text: req.body.param4,
              },
            ],
          },
        ],
      },
    },
  })
    .then(async (response) => {
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
});

//send template message to client for new payment notification
router.post('/new-payment-notification', (req, res) => {
  axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: 
            [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              },
              {
                type: 'text',
                text: req.body.param4,
              },
              {
                type: 'text',
                text: req.body.param5,
              }
            ]
          },
          {
            type: 'button',
            index: '0',
            sub_type: 'url',
            parameters: [
              {
                type: 'text',
                text: req.body.param6,
              },
            ],
          },
        ],
      },
    },
  })
    .then(async (response) => {
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});

//send template message to tutors to inform them weather they are active or not
router.post('/tutorActiveInactiveTemplate', async (req, res) => {
  try{
  await axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: 
           [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              },
              {
                type: 'text',
                text: req.body.param4,
              }
            ]

            }
        ],
      },
    },
  })
    .then(async (response) => {
      // msgId = response.data.messages[0].id
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
  }
  catch(error){
    console.log({error})
    res.status(500).json(error);
  }
});

//send session completed template message to clients
router.post('/sessionCompleteTemplate', async (req, res) => {
  try{
  await axios({
    method: 'post',
    url: 'https://waba.360dialog.io/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'D360-API-KEY': 'qjuT6BExOEWmhKqtGSOidRVSAK',
    },
    data: {
      to: req.body.wa_id,
      type: 'template',
      template: {
        namespace: req.body.template.namespace,
        language: {
          policy: 'deterministic',
          code: req.body.template.language,
        },
        name: req.body.templateName,
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: req.body.param1,
              },
            ],
          },
          {
            type: 'body',
            parameters: 
           [
              {
                type: 'text',
                text: req.body.param2,
              },
              {
                type: 'text',
                text: req.body.param3,
              }
            ]

          },
          {
            type: 'button',
            index: '0',
            sub_type: 'url',
            parameters: [
              {
                type: 'text',
                text: req.body.param4,
              },
            ],
          }
        ],
      },
    },
  })
    .then(async (response) => {
      // msgId = response.data.messages[0].id
      const newMsg = new Message({
        id: response.data.messages[0].id,
        name: req.body.name,
        from: req.body.from,
        wa_id: req.body.wa_id,
        templateName: req.body.templateName,
        templateText: req.body.templateText,
        button: req.body.button,
        timestamp: req.body.timestamp,
        operatorName: '',
        isOwner: req.body.isOwner,
        status: req.body.status,
        ticketId: '',
        eventType: 'template',
      });
      try {
        const savedMsg = await newMsg.save();
        res.status(200).json(savedMsg);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
  }
  catch(error){
    console.log({error})
    res.status(500).json(error);
  }
});

module.exports = router;
