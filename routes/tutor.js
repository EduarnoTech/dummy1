const router = require('express').Router();
const TutorSchema = require('../models/Tutor');
// const Session = require('../models/Session');

// const mongoose = require("mongoose");
// mongoose.set('debug', true)

// //add tutor
// router.post('/addTutor', async (req, res) => {
//   const tutorJson = {
//     tutor_id: req.body.tutor_id,
//     name: req.body.name,
//     wa_name: req.body.wa_name,
//     highest_degree: req.body.highest_degree,
//     academic_info: req.body.academic_info,

//     Bank: {
//       acc_no: req.body.Bank.acc_no,
//       ifsc_code: req.body.Bank.ifsc_code,
//       upi_id: req.body.Bank.upi_id,
//     },
//     contact_id: req.body.contact_id,
//     fund_upi_id: req.body.fund_upi_id,
//     fund_bank_id: req.body.fund_bank_id,
//     dept: req.body.dept,
//     subjects: req.body.subjects,
//     rating: req.body.rating,
//     wa_id: req.body.wa_id,
//     email: req.body.email,
//     type: req.body.type,
//     tutor_status: req.body.tutor_status,
//     tags: req.body.tags
//   };

//   console.log(tutorJson);

//   //saving data

//   try {
//     const session = new TutorSchema(tutorJson);

//     await session.save().then(() => console.log('Saved new Tutor'));

//     res.status(200).json(tutorJson);
//   } catch (err) {
//     res.status(500).json(err);
//   }

//   return JSON.stringify('ok');
// });


// find with Email Id
router.post('/findTutorByEmail', async (req, res) => {
  try {
  const findTutor = await TutorSchema.findOne({email:req.body.email});
 
   if(findTutor)
    res.status(200).json({success:true,result:findTutor});
    else{
      res.status(200).json({success:false});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//add tutor
router.post('/addTutor', async (req, res) => {
  const newContact = new TutorSchema(req.body);
  try {
    const savedContact = await newContact.save();
    res.status(200).json(savedContact);
  } catch (err) {
    res.status(500).json(err);
  }
});


  //update tutor
router.put('/updateTutor/:tutorId', async (req, res) => {
  try {
    const updatedTutor = await TutorSchema.updateOne({
      tutor_id: req.params.tutorId,
    }, {
      $set: {
        pan: req.body.pan
      }
    });
    res.status(200).json(updatedTutor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update tutor full info
router.post('/updateTutorInfo/:tutorId', async (req, res) => {
  try {
    const updatedTutor = await TutorSchema.updateOne({
      tutor_id: req.params.tutorId,
    }, {
      tutor_id:req.body.tutor_id,
      name: req.body.name,
      dept:req.body.dept,
      $set:{"academic_info.0.college":req?.body?.university},
      wa_id: req.body.watsNumber,
      email:req.body.email,
      writer:req.body.writer,
      $push:{tags:req?.body?.tags}
    });
    res.status(200).json(updatedTutor);
  } catch (err) {
    res.status(500).json(err);
    console.log({err})
  }
});


//get tutors
router.get('/getTutors', async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
 
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    const tutors = await TutorSchema.find({});
    const resultMessages = tutors.sort((a, b) => b.rating - a.rating).slice(startIndex, endIndex);
    res.status(200).json({tutors:tutors ,length: tutors.length, result: resultMessages});
  } catch (err) {
    req.status(500).json(err);
  }
});

//get tutorDetail
router.get('/getTutorDetail/:tutorId', async (req, res) => {
  try {
    const tutors = await TutorSchema.findOne({
      tutor_id: req.params.tutorId,
    });
    res.status(200).json(tutors);
  } catch (err) {
    res.status(500).json(err);
  }
});

//set tutors rating
router.put('/setTutorRating/:tutorId', async (req, res) => {
  let newRating = req.body.rating;
  try {
    const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });
    if (tutor.rating) newRating = (+newRating + +tutor.rating) / 2;

    let ratingObj={
      sessionId:req.body.session_done,
      rating:'' + newRating,
      speed:req.body.speed,
      accuracy:req.body.accuracy,
      legitimacy:req.body.legitimacy,
      reviews:req.body.reviews
    } 

    //session count of tutor
    if(tutor?.rating_and_reviews?.filter(el1=>el1.sessionId===req.body.session_done)?.length!==0)
    {
      const mongoReturn = await TutorSchema.updateOne({ tutor_id: req.params.tutorId },
      {
        rating: '' + newRating,
        $set: { "rating_and_reviews.$[temp]": ratingObj}
      },
      {
        arrayFilters: [
          { "temp.sessionId": req.body.session_done}]
      });
      res.status(200).json({tutor: mongoReturn,success:"old obj"});
    }
    else{
      const mongoReturn = await TutorSchema.updateOne({ tutor_id: req.params.tutorId },
        {
      rating: '' + newRating,
      $push: { rating_and_reviews: ratingObj, sessions_done: req.body.session_done}
    });
    res.status(200).json({tutor: mongoReturn,success:"new obj"});
  }
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// find tutorDetails by tutorId
router.get('/getTutorDetails/:tutorId', async (req, res) => {
  try {
    const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });
    res.status(200).json(tutor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add tag
router.put('/addTag/:tutorId', async (req, res) => {
  try {
    const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });
    let newTags = tutor.tags;

    newTags.push(req.body.tag);

    const mongoReturn = await tutor.update({
      tags: newTags,
    });
    res.status(200).json(mongoReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

//set status of tutor (active/inactive)
router.put('/setTutorStatus/:tutorId', async (req, res) => {
  try {
    const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });

    const mongoReturn = await tutor.update({
      tutor_status: req.body.status,
    });
    res.status(200).json(mongoReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

//set writer status for tutor (true/false)
router.put('/setTutorWriterStatus/:tutorId', async (req, res) => {
  try {
    const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });

    const mongoReturn = await tutor.update({
      writer: req.body.status
    });
    res.status(200).json(mongoReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get tutors by search
router.get("/getTutors/:tutorsearch", async (req,res) => {
  let page = req.query.page;
  let limit = req.query.limit;
 
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  // {
  //   $search: {
  //     text: {
  //       query: req.params.sessionsearch,
  //       path: ['client_id', 'session_id', 'subject', 'type', 'country', 'payment_status', 'work_status'],
  //       fuzzy: {
  //         prefixLength: 7,
  //       }
  //     },
  //   },
  // },

  const agg = [
    {
      $search: {
        text: {
          query: "*" + req.params.tutorsearch + "*",
          path: [{"wildcard": "name*"}, {"wildcard": "tutor_id*"}, {"wildcard": "wa_id*"}, {"wildcard": "subjects*"}, {"wildcard": "tags*"}, {"wildcard": "highest_degree*"}, {"wildcard": "dept*"}, {"wildcard": "academic_info.college*"}, {"wildcard": "academic_info.degree*"}],
          fuzzy: {
            prefixLength: 2
          }
        },
        highlight: {
          path: [{"wildcard": "name*"}, {"wildcard": "tutor_id*"}, {"wildcard": "wa_id*"}, {"wildcard": "subjects*"}, {"wildcard": "tags*"}, {"wildcard": "highest_degree*"}, {"wildcard": "dept*"}, {"wildcard": "academic_info.college*"}, {"wildcard": "academic_info.degree*"}],
        }
      },
    },
    {
      $project: {
        "_id": 0,
        "name": 1,
        "tutor_id": 1,
        "wa_id": 1,
        "subjects": 1,
        "tags": 1,
        "rating": 1,
        "tutor_status": 1,
        "writer": 1,
        "sessions_done": 1,
        "email": 1,
        "type": 1,
        "academic_info": 1,
        "contact_id": 1,
        "fund_upi_id": 1,
        "fund_bank_id": 1,
        "highest_degree": 1,
        "Bank": 1,
        "dept": 1,
        "software_skills": 1,
        "rating_and_reviews": 1,
        "pan": 1,
        "pout_id": 1,
        "highlights": { "$meta": "searchHighlights" }
      }
    }
 
  ];
 
 
  try {
    let tutors = await TutorSchema.aggregate(agg);
    const resultMessages = tutors.sort((a, b) => b.rating - a.rating).slice(startIndex, endIndex);
    res.status(200).json({length: tutors.length, result: resultMessages});
  } catch (err) {
    res.status(500).json(err);
  }
     
 
 
});

//delete tutor from db
router.post('/deleteTutor', async (req, res) => {
  try {
    const tutor = await TutorSchema.deleteOne({
      tutor_id: req.body.tutor_id,
    });
    res.status(200).json(tutor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//sessions assigned to tutor
router.post('/setTutorAssignedSession', async (req, res) => {
  try {
    const savedTutor = await TutorSchema.findOneAndUpdate(
      { tutor_id: req.body.tutorId },
      {
        $push: { sessions_assigned: req.body.sessions_assigned },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: savedTutor });
  } catch (err) {
    res.status(500).json(err);
  }
});


// update Email no. in tutor
router.put('/updateTutorEmail/:tutorId', async (req, res) => {
  try {
    const updatedTutor = await TutorSchema.updateOne({
      tutor_id: req.params.tutorId,
    }, {
      email:req.body.email,
    });
    res.status(200).json({success:true});
  } catch (err) {
    console.log({err})
    res.status(500).json(err);
  }
});


// update whatsApp no. in tutor
router.put('/updateTutorWaId/:tutorId', async (req, res) => {
  try {
    const updatedTutor = await TutorSchema.updateOne({
      tutor_id: req.params.tutorId,
    }, {
      wa_id:req.body.wa_id,
    });
    res.status(200).json({success:true});
  } catch (err) {
    console.log({err})
    res.status(500).json(err);
  }
});


//update tutor payment details through web
router.put('/updateTutorPaymentDetails/:tutorId', async (req, res) => {
  try {
    const tutorFind = await TutorSchema.findOne({
      tutor_id: req.params.tutorId})

      let tagsAr1=tutorFind.subjects;
      let tags1=[...tagsAr1,...req.body.tags]


    const updatedTutor = await TutorSchema.updateOne({
      tutor_id: req.params.tutorId,
    }, {
      $set: {
        "Bank.acc_no": req?.body?.accountNo,
        "Bank.ifsc_code": req?.body?.ifsc,
        "Bank.upi_id": req?.body?.upi_id,
      },
      pan: req?.body?.pan,
      tutor_status:req?.body?.tutor_status,
      subjects:tags1
     
    });
    res.status(200).json(updatedTutor);
  } catch (err) {
    res.status(500).json(err);
    console.log({err})
  }
});


// set new password for existing tutors
router.post("/openSetNewPasswordWindow", async (req, res) => {
  // const uid = req.body.uid;
  const _id = req.body._id;

  try {
    const result = await TutorSchema.findOne({ _id:_id });
    if (result && result._id == _id) {
      res.status(200).json({ status: true });
    } else {
      res.status(400).json({ status: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false });
  }
});

module.exports = router;