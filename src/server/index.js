const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://eduarnochatapp.el.r.appspot.com/',
  },
});
app.use(cors());

app.use(express.json());

const PORT = 8080;
const HOST ='0.0.0.0'; 

let msgs = [];
app.use(express.static(__dirname + '/../../build'));

let _agent;
let _device;
let _api = 'https://annular-arena-331607.el.r.appspot.com/d1';
let _status = [];
let payments = [];
let sendPayments = [];
let interestedTutors = [];
let paypalPayments = [];
let newSession = [];

app.use('/',(req,res)=>{
  res.send("hare krsna hare krsna KRSNA KRSNA")
})

io.on('connection', (socket) => {
  //when connect
  console.log('a user connected.', socket.id);
  io.emit('welcome', msgs);

  // socket.on('user', ({ api, device }) => {
  //   // console.log('api', api);
  //   // console.log('device', device);
  //   _api = api;
  //   _device = device;

  // webhook 1
  app.post("/api/webhook1", (req, res) => {
    let url = `${_api}/api/messages`;
    const msg = req.body;

    msgs.push(msg);
    res.send(msg);

    // console.log(_agent);

    console.log('data', JSON.stringify(msgs));
    io.emit('getUsers', msgs);

    io.emit('getAlert', msg);

    if (req.body.contacts) {
      axios({
        method: 'post',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: {
          conversationId: '',
          id: req?.body?.messages[0]?.id,
          name: req?.body?.contacts[0]?.profile?.name,
          from: req?.body?.messages[0]?.from,
          wa_id: req?.body?.contacts[0]?.wa_id,
          text: req?.body?.messages[0]?.text,
          replyButton:
            req?.body?.messages[0]?.button &&
            req?.body?.messages[0]?.button?.text,
          context:
            req?.body?.messages[0]?.context && req?.body?.messages[0]?.context,
          type: req?.body?.messages[0]?.type,
          data:
            req?.body?.messages[0]?.image ||
            req?.body?.messages[0]?.video ||
            req?.body?.messages[0]?.document ||
            req?.body?.messages[0]?.voice ||
            req?.body?.messages[0]?.audio,
          timestamp: req?.body?.messages[0]?.timestamp,
          operatorName: '',
          isOwner: req?.body?.messages[0]?.from ? false : true,
          // status: req?.body?.statuses[0]?.status,
          ticketId: '',
          eventType: '',
        },
      })
        .then(function (response) {
          return JSON.stringify(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      axios({
        method: 'get',
        url: `${_api}/api/conversations/findContact/${req?.body?.contacts[0]?.wa_id}`,
      }).then((response) => {
        if (
          response?.data?.status =='success' && response?.data?.count == 0
        ) {
          axios({
            method: 'get',
            url: `${_api}/api/agent/getActiveAgents`,
          })
          .then((agents) => {
            axios({
              method: 'post',
              url: `${_api}/api/conversations`,
              headers: { 'Content-Type': 'application/json' },
              data: {
                wa_id: req.body.contacts[0].wa_id,
                name: req.body.contacts[0].profile.name,
                phone: req.body.contacts[0].wa_id,
                countryCode: '',
                uid: +response?.data?.lastObj?.uid + 1 + '',
                members: req.body.contacts,
                newMsgCount: 1,
                agent: agents?.data.length == 1 ? agents?.data[0]?.agent : agents?.data.length == 2 ? agents?.data.filter((i) => i.agent != response?.data?.lastObj?.agent)[0]?.agent : agents?.data.length == 3 ? agents?.data.filter((i) => i.agent != response?.data?.lastObj?.agent)[1]?.agent : agents?.data.length == 4 ? agents?.data.filter((i) => i.agent != response?.data?.lastObj?.agent)[1]?.agent : agents?.data.length == 5 ? agents?.data.filter((i) => i.agent != response?.data?.lastObj?.agent)[3]?.agent : 'Admin',
                // agent: agents?.data.length == 1 ? agents?.data[0]?.agent : agents?.data.length == 2 && (response?.data?.lastObj?.uid % 10) % 2 == 0 ? agents?.data[0]?.agent : agents?.data.length == 2 && (response?.data?.lastObj?.uid % 10) % 2 == 1 ? agents?.data[1]?.agent : 'Admin',
                timestamp: req?.body?.messages[0]?.timestamp,
              },
            })
            .then((response) => {
              io.emit('save', req?.body?.messages[0]?.timestamp);
              return JSON.stringify(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          })
          .catch((err) => {
            axios({
              method: 'post',
              url: `${_api}/api/conversations`,
              headers: { 'Content-Type': 'application/json' },
              data: {
                wa_id: req.body.contacts[0].wa_id,
                name: req.body.contacts[0].profile.name,
                phone: req.body.contacts[0].wa_id,
                countryCode: '',
                uid: +response?.data?.lastObj?.uid + 1 + '',
                members: req.body.contacts,
                newMsgCount: 1,
                agent: 'Admin',
                timestamp: req?.body?.messages[0]?.timestamp,
              },
            })
            .then((response) => {
              io.emit('save', req?.body?.messages[0]?.timestamp);
              return JSON.stringify(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          });
        } else if (
          response?.data?.status =='success' && response?.data?.count > 0
        ) {
          axios({
            method: 'put',
            url: `${_api}/api/conversations/${req.body.contacts[0].wa_id}`,
            headers: { 'Content-Type': 'application/json' },
            data: {
              newMsgCount: +response.data.result[0].newMsgCount + 1,
              timestamp: req?.body?.messages[0]?.timestamp,
            },
          })
            .then((resp) => {
              io.emit('update', req?.body?.messages[0]?.timestamp);
              return JSON.stringify(resp.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
      // axios({
      //   method: 'post',
      //   url: '${localStorage.getItem('api')}/api/alerts',
      //   headers: { 'Content-Type': 'application/json' },
      //   data: {
      //     conversationId: '',
      //     id: req?.body?.messages[0]?.id,
      //     name: req?.body?.contacts[0]?.profile?.name,
      //     from: req?.body?.messages[0]?.from,
      //     wa_id: req?.body?.contacts[0]?.wa_id,
      //     text: req?.body?.messages[0]?.text,
      //     type: req?.body?.messages[0]?.type,
      //     data: req?.body?.messages[0]?.image || req?.body?.messages[0]?.video || req?.body?.messages[0]?.document,
      //     timestamp: req?.body?.messages[0]?.timestamp,
      //     operatorName: '',
      //     isOwner: req?.body?.messages[0]?.from ? false : true,
      //     status: 'newMsg',
      //     ticketId: '',
      //     eventType: ''
      //   }
      // })
      //   .then(function (response) {
      //     io.emit("notification", req?.body?.messages[0]?.timestamp);
      //     return JSON.stringify(response.data);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
    } else if (req.body.statuses) {
      axios({
        method: 'put',
        url: `${_api}/api/messages/${req.body.statuses[0].id}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          conversationId: req?.body?.statuses[0]?.conversation?.id,
          id: req?.body?.statuses[0]?.id,
          name: '',
          from: '',
          wa_id: req?.body?.statuses[0]?.recipient_id,
          text: '',
          type: '',
          data: '',
          timestamp: req?.body?.statuses[0]?.timestamp,
          operatorName: '',
          isOwner: req?.body?.statuses[0]?.recipient_id ? true : true,
          status: req?.body?.statuses[0]?.status,
          ticketId: '',
          eventType: '',
        },
      })
        .then(function (response) {
          let stat = {
            msgStatus: req?.body?.statuses[0]?.status,
            msgId: req?.body?.statuses[0]?.id,
            timestamp: req?.body?.statuses[0]?.timestamp
          }
          _status.push(stat);
          let filtered = _status.sort((a, b) => {
            if(b.timestamp == a.timestamp) {
              return -1;
            }
            else { 
              return b.timestamp - a.timestamp;
            }
          })
          io.emit('statusChanged', filtered);
          return JSON.stringify(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      // axios({
      //   method: 'get',
      //   url: '${localStorage.getItem('api')}/api/conversations/getContacts'
      // }).then(response => {
      //   if (!response.data.find(el => el.wa_id == req.body.contacts[0].wa_id)) {
      //     axios({
      //       method: 'post',
      //       url: '${localStorage.getItem('api')}/api/conversations',
      //       headers: { 'Content-Type': 'application/json' },
      //       data: {
      //         wa_id: req.body.contacts[0].wa_id,
      //         name: req.body.contacts[0].profile.name,
      //         phone: req.body.contacts[0].wa_id,
      //         countryCode: '',
      //         members: req.body.contacts
      //       }
      //     })
      //       .then((response) => {
      //         return JSON.stringify(response.data);
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //       });
      //   }
      // });
    }
  });
  // });

  // socket.on('sessionAlert', () => {
  // });

  //for receive payment
  app.post("/api/rpayWebhook", async(req, res) => {
    const pay = req.body;
    payments.push(pay);
    res.send(pay);

    // // sending to device5
    // await axios({
    //   method: 'post',
    //   url: 'https://robotic-haven-330413.el.r.appspot.com/api/rpayWebhook',
    //   data: pay
    // });
    // // sending to device2
    // await axios({
    //   method: 'post',
    //   url: 'https://device2chat.el.r.appspot.com/api/rpayWebhook',
    //   data: pay
    // });
    // // sending to device3
    // await axios({
    //   method: 'post',
    //   url: 'https://device3chatapp.el.r.appspot.com/api/rpayWebhook',
    //   data: pay
    // });
    // // sending to device4
    // await axios({
    //   method: 'post',
    //   url: 'https://aerial-mission-330313.el.r.appspot.com/api/rpayWebhook',
    //   data: pay
    // });


    io.emit('rpayNoti', payments);
    console.log("payment", JSON.stringify(pay));

    if(pay.payload.payment_link && pay.event.includes("payment_link")) {
    await axios({
      method: 'post',
      url: `https://annular-arena-331607.el.r.appspot.com/d1/api/sessions/savePaymentInfo`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        plink_id: pay.payload.payment_link.entity.id,
        payment_status: pay.payload.payment_link.entity.status,
        payment_info: {...pay.payload.payment.entity, type: 'plink'}
      },
    })
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
    }
    else if(pay.payload.virtual_account && pay.event == "virtual_account.credited") {
      await axios({
        method: 'post',
        url: `https://annular-arena-331607.el.r.appspot.com/d1/api/sessions/savePaymentInfo-vpa`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          va_id: pay.payload.virtual_account.entity.id,
          payment_info: {...pay.payload.payment.entity, type: 'vpa'}
        },
      })
        .then(function (response) {
          return JSON.stringify(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    // io.emit('getAlert', msg);
  });

  //for sending payment
  app.post("/api/rpayXWebhook", async(req, res) => {
    const payX = req.body;
    sendPayments.push(payX);
    res.send(payX);

    // sending to device2
    await axios({
      method: 'post',
      url: 'https://device2chat.el.r.appspot.com/api/rpayXWebhook',
      data: payX
    });
    // sending to device3
    await axios({
      method: 'post',
      url: 'https://device3chatapp.el.r.appspot.com/api/rpayXWebhook',
      data: payX
    });
    // sending to device4
    await axios({
      method: 'post',
      url: 'https://aerial-mission-330313.el.r.appspot.com/api/rpayXWebhook',
      data: payX
    });
    // sending to device5
    await axios({
      method: 'post',
      url: 'https://robotic-haven-330413.el.r.appspot.com/api/rpayXWebhook',
      data: payX
    });
    // sending to device6
    await axios({
      method: 'post',
      url: 'https://device6chat.el.r.appspot.com/api/rpayXWebhook',
      data: payX
    });

    io.emit('rpayXNoti', payX);
    console.log("payment", JSON.stringify(payX));
  });

  // //for receive payment from paypal
  // app.post("/api/paypalWebhook", async(req, res) => {
  //   const payPal = req.body;
  //   paypalPayments.push(payPal);
  //   res.send(payPal);
  //   io.emit('paypalNoti', payPal);
    
  //   if(pay.payload.payment_link) {
  //     await axios({
  //       method: 'post',
  //       url: `${_api}/api/sessions/savePaymentInfo`,
  //       headers: { 'Content-Type': 'application/json' },
  //       data: {
  //         plink_id: pay.payload.payment_link.entity.id,
  //         payment_status: pay.payload.payment_link.entity.status,
  //         payment_info: pay.payload.payment.entity
  //       },
  //     })
  //       .then(function (response) {
  //         return JSON.stringify(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //     }
  // });

  //new interested tutors availability
  app.post("/api/interestedTutors", async(req, res) => {
    const tutors = req.body;
    interestedTutors.push(tutors);
    res.send(tutors);
    io.emit('interestedTutors', interestedTutors.reverse().slice(0, 30));
    console.log(interestedTutors)
  });

  //new session available
  app.post("/api/newSession", async(req, res) => {
    const newSsn = req.body;
    newSession.push(newSsn);
    res.send(newSsn);
    io.emit('newSession', newSession.reverse().slice(0, 30));
    console.log(newSession)
  });

  socket.on('agent', (agent) => {
    // console.log('agent', agent);
    _agent = agent;
  });
 

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});
// app.post("/api/rpayWebhook", (req, res) => {
//   const pay = req.body;
//   payments.push(pay);
//   res.send(pay);
//   console.log("payment", JSON.stringify(payments));
// })

server.listen(PORT,HOST)
console.log("running on port 8080")
