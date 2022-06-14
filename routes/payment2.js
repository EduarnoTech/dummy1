const router = require('express').Router();
const axios = require('axios');
const base64 = require('base-64');
const Session = require('../models/Sessions2');
const Tutor = require('../models/Tutor');

// const mongoose = require("mongoose");
// mongoose.set('debug', true)

//get payment link by id
router.get("/getPaymentLink/:plink_id",async (req,res)=>{
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/payment_links/${req.params.plink_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      }
    };
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//update a payment link
router.patch("/updatePaymentLink/:plink_id",async (req,res)=>{

    let data = JSON.stringify(req.body);
      
    let config = {
        method: 'patch',
        url: `https://api.razorpay.com/v1/payment_links/${req.params.plink_id}`,
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        res.status(200).json(response.data);
    
      })
      .catch(function (error) {
        res.status(500).json(error);
      });

});


//get all payment links
router.get("/payment_links",async (req,res)=>{
      
    let config = {
        method: 'get',
        url: "https://api.razorpay.com/v1/payment_links/",
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

        }
      };
      
      axios(config)
      .then(function (response) {
        res.status(200).json(response.data);
    
      })
      .catch(function (error) {
        res.status(500).json(error);
      });

});


//resend payment link
router.post("/payment_links/:plink_id/notify_by/sms/",async (req,res)=>{

    let data = JSON.stringify(req.body);
      
    let config = {
        method: 'post',
        url: `https://api.razorpay.com/v1/payment_links/${req.params.plink_id}/notify_by/sms/`,
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        res.status(200).json(response.data);
    
      })
      .catch(function (error) {
        res.status(500).json(error);
      });

});


//create virtual account and vpa
router.post("/virtual_accounts",async (req,res)=>{

    let data = JSON.stringify({
        "receivers": {
          "types": [
            "bank_account",
            "vpa"
          ]
        },
        "description": "Virtual Account created for tutorpoint",
        "close_by": 1681615838,
        "notes": {
          "payment_type": "paid_to_vpa"
        }
      });
      
  let config = {
      method: 'post',
      url: 'https://api.razorpay.com/v1/virtual_accounts',
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(async (response) => {
        console.log(response);
        try {
            
            const sessions = await Session.findOneAndUpdate(
                { session_id: req.body.session_id },
                {
                  va_id: response.data.id,
                },
                {
                  upsert: true,
                  new: true,
                  setDefaultsOnInsert: true,
                }
              );
          res.status(200).json(response.data);
            } catch (error) {
                res.status(500).json(error);
            }
  
    })
    .catch((error) => {
      res.status(500).json(error);
    });

});


//create refunds to virtual account using payment id 
router.post("/virtual_accounts/payments/:pay_id/refund",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/payments/${req.params.pay_id}/refund`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

    console.log(data);
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//fetch a virtual account by ID
router.get("/virtual_accounts/:va_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/virtual_accounts/${req.params.va_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

    console.log(data);
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//fetch all virtual accounts
router.get("/virtual_accounts",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/virtual_accounts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//fetch all payments of a virtual ID
router.get("/virtual_accounts/:va_id/payments",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/virtual_accounts/${req.params.va_id}/payments`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//create partial/full refund, remove amount field for full refund and add speed field (optimum) for instant refund
router.post("/payments/:pay_id/refund",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/payments/${req.params.pay_id}/refund`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//*TUTOR APIS, THEY ARE USED TO PAY TUTORS OR SEND PAYMENTS TO THE REQUIRED TUTORS*

//create contact
router.post("/contacts",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/contacts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        type: req.body.type,
        reference_id: req.body.reference_id,
        notes: {
          random_key_1: 'tutor\'s new contact id creation',
          random_key_2: 'vendon contact id',
        },
      }
    };

    axios(config)
    .then(async(response) => {
      try {
        // const findTutor_ = await Tutor.findOne({wa_id: req.body.contact});
        // const updateTutor = await findTutor_.update({
        //   wa_id: req.body.contact,
        //   contact_id: response?.data?.id
        // });
        const updatedData = await Tutor.findOneAndUpdate(
          {wa_id: req.body.contact},
          {
            wa_id: req.body.contact,
            contact_id: response?.data?.id
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        
        console.log(updatedData);
        res.status(200).json(updatedData);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});



//fetch contacts
router.get("/contacts",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/contacts?count=${req.query.count}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//create fund account bank
router.post("/fund_accounts_bank/:wa_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/fund_accounts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(async(response) => {
      try {
        // const _findTutor = await Tutor.findOne({wa_id: req.params.wa_id});
        // const updateTutor = await _findTutor.update({
        //   wa_id: req.params.wa_id,
        //   fund_bank_id: response?.data?.id,
        // });
        const updateTutor = await Tutor.findOneAndUpdate(
          {wa_id: req.params.wa_id},
          {
            wa_id: req.params.wa_id,
            fund_bank_id: response?.data?.id,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        res.status(200).json(updateTutor);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//create fund account upi
router.post("/fund_accounts_upi/:wa_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/fund_accounts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(async(response) => {
      try {
        // const _findTutor = await Tutor.findOne({wa_id: req.params.wa_id});
        // const updateTutor = await _findTutor.update({
        //   wa_id: req.params.wa_id,
        //   fund_upi_id: response?.data?.id,
        // });
        const updateTutor = await Tutor.findOneAndUpdate(
          {wa_id: req.params.wa_id},
          {
            wa_id: req.params.wa_id,
            fund_upi_id: response?.data?.id,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        res.status(200).json(updateTutor);
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});



//validation fund account
router.post("/fund_accounts/validations",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/fund_accounts/validations`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      
      res.status(200).json(response.data);
     
  
    })
    .catch(function (error) {
      res.status(500).json(error);
      
    });

});

//Fetch account validation transactions by ID
router.get("/fund_accounts/validations/:fav_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/fund_accounts/validations/${req.params.fav_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//fetch all account validation transactions
router.get("/fund_accounts/validations",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/fund_accounts/validations`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//*TUTORLANCER RAZORPAY X APIs*

//fetch contact by ID
router.get("/contacts/:cont_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/contacts/${req.params.cont_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//Update contact by ID
router.patch("/contacts/:cont_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'patch',
      url: `https://api.razorpay.com/v1/contacts/${req.params.cont_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//fetch all fund accounts
router.get("/fund_accounts",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/fund_accounts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//fetch fund account by Id
router.get("/fund_accounts/:fa_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/fund_accounts/${req.params.fa_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//create payout// TEST ACCOUNT NO. 3434949239801329
router.post("/payouts/:waId/:sessionId",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/payouts`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(async(response) => {
      
      try {
        // const _findTutor = await Tutor.findOne({wa_id: req.params.wa_id});
        // const updateTutor = await _findTutor.update({
        //   wa_id: req.params.wa_id,
        //   fund_upi_id: response?.data?.id,
        // });
        const updateTutor = await Session.updateOne(
          {session_id: req.params.sessionId, "assigned_tutors.wa_id": req.params.waId},     
          { $push: { "assigned_tutors.$.pout_info" : response?.data } }
            // assigned_tutors[0].pout_id: response?.data?.id,
        );
        res.status(200).json({rpay: response.data, db: updateTutor});
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify('ok');
  
     
  
    })
    .catch(function (error) {
      res.status(500).json(error);
      
    });

});


//fetch all payouts
router.get("/payouts",async (req,res)=>{

  // let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/payouts`,
      params: {account_number: req.query.account_number},
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " + base64.encode(req.headers['username'] + ':' + req.headers['password'])

      }
    };

  
    
    await axios(config)
    .then(function (response) {
      console.log(response.data)
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      console.log(error)
      res.status(500).json(error);
    });

});


//fetch payout by ID & update tutor payout status
router.post("/payout-update/:pout_id", async (req,res)=> {
  // let data = JSON.stringify(req.body);  
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/payouts/${req.params.pout_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])
      }
    };
    axios(config)
    .then(async(response) => {
      try {
        const updateTutorPayment = await Session.updateOne(
          {session_id: req.body.sessionId, "assigned_tutors.wa_id": req.body.waId},
          { $set: { "assigned_tutors.$.pout_info.$[element]" : response.data } },
          { arrayFilters: [ { "element.id": req.params.pout_id } ] }
        );
        res.status(200).json({ success: true, result: updateTutorPayment });
      } catch (err) {
        res.status(500).json(err);
      }
      // res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//cancel queued payouts
router.post("/payouts/:pout_id/cancel",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'post',
      url: `https://api.razorpay.com/v1/payouts/${req.params.pout_id}/cancel`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " +   base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});


//fetch all transactions
router.get("/transactions",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/transactions?account_number=${req.query.account_number}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " + base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

//fetch transaction by ID
router.get("/transactions/:txn_id",async (req,res)=>{

  let data = JSON.stringify(req.body);
      
  let config = {
      method: 'get',
      url: `https://api.razorpay.com/v1/transactions/${req.params.txn_id}`,
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": "Basic " + base64.encode(req.headers['username'] + ":" + req.headers['password'])

      },
      data : data
    };

  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

// razorpay refund api call
router.post("/initiate-refund/:payId",async (req,res)=>{

  let config = {
    method: 'post',
    url: `https://api.razorpay.com/v1/payments/${req.params.payId}/refund`,
    headers: { 
      'Content-Type': 'application/json',
      "Authorization": "Basic " + base64.encode(req.headers['username'] + ":" + req.headers['password'])

    },
    data: {
      amount: req.body.amount
    }
    
}
  
    
    axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
  
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

});

// refund by using payment id
router.post("/refund/:sessionId/:payId", async (req, res) => {
 
    try {
      const updateTutor = await Session.updateOne(
        {session_id: req.params.sessionId, "payment_info.id": req.params.payId},
        { 
          $push: { "payment_info.$.refund_info" : req.body.refundInfo },
          refund_status: "refunded"
        }
        // { $push: { "payment_info.$.refund_status" : response?.data?.status, "payment_info.$.refund_id" : response?.data?.id, "payment_info.$.refund_timestamp" : response?.data?.created_at, "payment_info.$.refund_speed" : response?.data?.speed_processed, "payment_info.$.refund_amount" : response?.data?.amount } }
          // assigned_tutors[0].pout_id: response?.data?.id,
      );
      res.status(200).json({db: updateTutor});
    } catch (err) {
      res.status(500).json(err);
    }
});


/* paypal receive payment from client apis */
// create draft invoice and send invoice api
router.post("/paypal/invoicing", async (req, res) => {

  let data = {
    detail: {
      invoice_number: req.body.invoice_number,
      reference: req.body.reference,
      invoice_date: req.body.invoice_date,
      currency_code: req.body.currency,
      // payment_term: {
      //   term_type: 'NET_10',
      //   due_date: req.body.payment_due_date,
      // },
    },
    invoicer: {
      name: {
        given_name: 'Vivek',
        surname: 'Kumar',
      },
      address: {
        address_line_1:
          'In front of New Horizon School ,Shivam Vihar Colony ,Kotra Road',
        address_line_2: 'Raigarh',
        admin_area_2: 'Kotara',
        admin_area_1: 'Chhattisgarh',
        postal_code: '496001',
        country_code: 'IN',
      },
      email_address: 'tutorpointeduarno@gmail.com',
      phones: [
        {
          country_code: '91',
          national_number: '7389805614',
          phone_type: 'MOBILE',
        },
      ],
      website: 'www.tutorpoint.in',
    },
    primary_recipients: [
      {
        billing_info: {
          name: {
            given_name: req.body.client_name,
            surname: '',
          },
          email_address: req.body.client_email,
        },
      },
    ],
    items: [
      {
        name: req.body.item_name,
        quantity: '1',
        unit_amount: {
          currency_code: req.body.currency,
          value: req.body.amount,
        },
        unit_of_measure: 'QUANTITY',
      },
    ],
    configuration: {
      allow_tip: false,
      tax_calculated_after_discount: true,
      tax_inclusive: false,
    },
    amount: {
      breakdown: {
        shipping: {
          amount: {
            currency_code: 'USD',
            value: '0.00',
          },
        },
      },
    },
  };
  
  console.log(JSON.stringify(data))

  let config = {
    method: 'post',
    url: `https://api-m.paypal.com/v2/invoicing/invoices`,
    headers: { 
      'Content-Type': 'application/json',
      "Authorization": "Basic " + base64.encode(req.headers['username'] + ":" + req.headers['password'])
    },
    data: JSON.stringify(data)
  }
  axios(config)
  .then(async(response) => {
    res.status(200).json(response?.data);
  })
  .catch((error) => {
    res.status(500).json(error);
  }
  );
});

// paypal send invoice
router.post("/paypal/send-invoice", async (req, res) => {

      let data = {
        send_to_invoicer: true
      }
      let config = {
        method: 'post',
        url: `${req.body.href}/send`,
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": "Basic " + base64.encode(req.headers['username'] + ":" + req.headers['password'])
        },
        data: JSON.stringify(data)
      }
      axios(config)
      .then(async (resp) => {
        console.log(resp.data)
        try {
          const paypalSession = await Session.findOneAndUpdate(
            { session_id: req.body.session_id },
            {
              paypal_url: resp?.data?.href,
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );
          res.status(200).json({rpay: resp.data, db: paypalSession});
          } catch (err) {
            res.status(500).json(err);
          };
      })
      .catch((err) => {
        res.status(500).json(err);
      });
});


module.exports = router;