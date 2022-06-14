const router = require("express").Router();
const Session = require("../models/Sessions7");
const Client = require("../models/Clients7");
const axios = require("axios");
const upload = require("../filesave");

const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const base64 = require("base-64");
const { Readable } = require("stream");
const nodemailer = require("nodemailer");

const CLIENT_ID =
  "831170386816-nc4hts2cbl21o5slo4kah59mc1q2i05k.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//04ndJ7bFzKndqCgYIARAAGAQSNwF-L9IrRpzre3yKbDTkl5Lhh2giG__S-X0J0AILmneXueTx0AfLXH9V3oF2uc6o4hBycknOnWI";

// add session new

// find form api
router.post("/findform", async (req, res) => {
  let clientId = req.body.clientId;
  let sessionId = req.body.sessionId;
  console.log(clientId);

  console.log("chalu to ho");
  try {
    const result = await Client.findOne({ client_id: clientId });
    const result1 = await Session.findOne({ session_id: sessionId });
    // console.log(result);
    // console.log(result1);

    var formResult = {
      name: result.client_name,
      email: result.email,
      username: result.socialmedia.username,
      university: result.university,
      semester: result.semester,
      branch: result.branch,
      subject: result1.subject,
      date_time: result1.deadline,
      client_time: result1.client_time,
      duration: result1.duration,
      timezone: result.timezone,
      type: result1.type,
      files: result1.client_files,
      country: result1.country,
      city: result1.city,
      folderlink: result1.folderlink,
      quesFolderLink: result1.quesFolderLink,
      rating_client: result1.rating_client,
      session_status: result1.work_status,
      comments: result1.client_comments,
    };

    console.log({ formResult: formResult });
    res.send(formResult);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    console.log("findform not working");
  }
});

// get client personal info by client id
router.get("/getclientinfo/:clientId", async (req, res) => {
  let clientId = req.params.clientId;
  try {
    const result = await Client.findOne({ client_id: clientId });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// add and update client data

router.post("/updateClient", async (req, res) => {
  const clientId = req.body.whatsapp;

  try {
    const result = await Client.findOneAndUpdate(
      { client_id: clientId },
      {
        client_id: clientId,
        whatsapp: "",
        client_name: req.body.name,
        university: req.body.university,
        semester: req.body.semester,
        branch: req.body.branch,
        email: req.body.email,
        timezone: req.body.timezone,
        socialmedia: {
          // "platform":req.body.socialmedia.platform,
          username: req.body.fb_username,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("result:", result);

    res.status(200).json({ success: true });

    console.log("working client backend");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    console.log("not_working client");
  }
});

// client rating
router.post("/client_rating", async (req, res) => {
  const result = await Session.findOneAndUpdate(
    { session_id: req.body.sessionId },
    {
      rating_client: req.body.rating_client,
    }
  );

  if (result) {
    console.log({ ratingVal: result.rating_client });
    res.status(200).json({ ratingSuccess: true });
  } else {
    res.status(400).json({ ratingSuccess: false });
  }
  console.log("RatingResult:", result);
});

//addsession old  api call (not in use now)
router.post("/addSession_old", upload.array("files[]"), async (req, res) => {
  let clientId = req.body.clientId;
  let sessionId = req.body.sessionId;
  const type = req.body.type;
  console.log({ sessionId1: sessionId });
  console.log({ clientId1: clientId });
  // try {
  const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oauth2client,
  });

  let fileName = [];
  let filelink = [];

  // console.log({ reqfiles: req.files });
  let postData = {
    // "sessionId":sessionId,
    client_id: clientId,
    session_id: sessionId,
    client_files: fileName,
    filelink: filelink,
    client_comments: req.body.client_comments,
    branch: req.body.branch,
    subject: req.body.subject,
    deadline: req.body.date_time,
    client_time: req.body.client_time,
    duration: req.body.duration,
    folderlink: "",
    quesFolderLink: "",
    country: req.body.country,
    city: req.body.city,
    type: type,
  };

  try {
    var clientFolderSearch = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='Client-${clientId}'`,
      fields: "files(id,name)",
    });

    console.log({ create3: clientFolderSearch.data.files });
    // try {
    var ClientFolder = clientFolderSearch.data.files[0];

    // SEARCHING FOR SESSION FOLDER

    if (clientFolderSearch.data.files.length !== 0) {
      var sessionFolderSearch = await drive.files.list({
        q: ` name='Session-${sessionId}' and '${ClientFolder.id}' in parents`,
        fields: "files(id,name)",
      });
      console.log({ sessionisthere: sessionFolderSearch.data.files });

      if (sessionFolderSearch.data.files.length !== 0) {
        var solutionFolderSearch = await drive.files.list({
          q: ` name='Solutions-${sessionId}' and '${sessionFolderSearch.data.files[0].id}' in parents`,
          fields: "files(id,name)",
        });

        console.log({ solnId: solutionFolderSearch.data.files });
        if (solutionFolderSearch.data.files.length == 0) {
          await drive.files.create({
            resource: {
              name: `Solutions-${sessionId}`,
              mimeType: "application/vnd.google-apps.folder",
              parents: [sessionFolderSearch.data.files[0].id],
            },
            fields: "id",
          });
          await drive.permissions.create({
            fileId: solutionFolderSearch.data.files[0].id,
            requestBody: {
              role: "writer",
              type: "anyone",
              // emailAddress:"shiv7255918@gmail.com"
            },
          });
        } else {
          console.log("alredy has soln folder");
        }

        // Question folder search

        var questionFolderSearch = await drive.files.list({
          q: ` name='Questions-${sessionId}' and '${sessionFolderSearch.data.files[0].id}' in parents`,
          fields: "files(id,name)",
        });

        console.log({ quesId: questionFolderSearch.data.files });

        if (questionFolderSearch.data.files.length !== 0) {
          let sessionFolderId = sessionFolderSearch.data.files[0].id;
          let questionFolderId = questionFolderSearch.data.files[0].id;

          await drive.permissions.create({
            fileId: sessionFolderId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
          const folderLink = await drive.files.get({
            fileId: sessionFolderId,
            fields: "webViewLink",
          });

          // question folder link
          await drive.permissions.create({
            fileId: questionFolderId,
            requestBody: {
              type: "anyone",
              role: "writer",
            },
          });
          const quesFolderLink = await drive.files.get({
            fileId: questionFolderId,
            fields: "webViewLink",
          });

          console.log({ folderLink: folderLink.data });
          console.log({ quesFolderLink: quesFolderLink.data });

          if (folderLink) {
            postData.folderlink = folderLink.data.webViewLink;
          } else {
            console.log("Didn't got folder link");
          }

          if (quesFolderLink) {
            postData.quesFolderLink = quesFolderLink.data.webViewLink;
          } else {
            console.log("Didn't got questions folder link");
          }

          //UPLOADING FILE INTO GOOGLE DRIVE 1st
          if (req.files && req.files.length > 0) {
            req.files.forEach(async (file, index, arr) => {
              fileName.push(" " + file.originalname);
              const fileBuffer = file.buffer;

              const stream = Readable.from(fileBuffer);
              var response = await drive.files.create({
                requestBody: {
                  name: `${file.originalname}_${type}--${clientId}/${sessionId}`,
                  mimeType: file.mimeType,
                  parents: [questionFolderSearch.data.files[0].id],
                },
                media: {
                  mimeType: file.mimeType,
                  body: stream,
                },
              });
              console.log({ DriveData: response.data });
              let fileId = response.data.id;

              await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                  role: "reader",
                  type: "anyone",
                },
              });
              drive.files
                .get({
                  fileId: fileId,
                  fields: "webViewLink,webContentLink",
                })
                .then(async (resUrl) => {
                  // console.log({ resUrl });
                  // try {
                  let weblink = resUrl.data.webViewLink;
                  console.log({ first_link: resUrl.data });
                  filelink.push(weblink);
                  const result = await Session.findOneAndUpdate(
                    { session_id: sessionId },
                    postData,
                    {
                      upsert: true,
                      new: true,
                      setDefaultsOnInsert: true,
                    }
                  );
                  console.log("result:", result);

                  // res.send({ success: true });

                  console.log("working session backend");
                });

              // await unlinkAsync(filePath);
              console.log("file deleted from disk");
              console.log({ filelink11: filelink });
            });
          } else {
            const result = await Session.findOneAndUpdate(
              { session_id: sessionId },
              {
                client_id: clientId,
                session_id: sessionId,
                client_files: fileName,
                client_comments: req.body.client_comments,
                branch: req.body.branch,
                subject: req.body.subject,
                deadline: req.body.date_time,
                client_time: req.body.client_time,
                duration: req.body.duration,
                folderlink: folderLink.data.webViewLink,
                quesFolderLink: quesFolderLink.data.webViewLink,
                country: req.body.country,
                city: req.body.city,
                type: type,
              },
              {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
              }
            );
            console.log("result:", result);
            console.log("working session backend");
          }
        }
        // if ques folder is not there
        else {
          var createQuesFolder = await drive.files.create({
            resource: {
              name: `Questions-${sessionId}`,
              mimeType: "application/vnd.google-apps.folder",
              parents: [sessionFolderSearch.data.files[0].id],
            },
            fields: "id",
          });

          req.files.forEach(async (file, index, arr) => {
            // fileName = fileName + file.originalname + ",";
            fileName.push(" " + file.originalname);
            const fileBuffer = file.buffer;

            const stream = Readable.from(fileBuffer);
            var response = await drive.files.create({
              requestBody: {
                name: `${file.originalname}_${type}--${clientId}/${sessionId}`,
                mimeType: file.mimeType,
                parents: [createQuesFolder.data.id],
              },
              media: {
                mimeType: file.mimeType,
                body: stream,
              },
            });

            console.log({ DriveData: response.data });
            let fileId = response.data.id;

            let sessionFolderId = sessionFolderSearch.data.files[0].id;
            let questionFolderId = createQuesFolder.data.id;

            await drive.permissions.create({
              fileId: sessionFolderId,
              requestBody: {
                role: "reader",
                type: "anyone",
                // type: "user",
                // emailAddress:"shiv7255918@gmail.com"
              },
            });

            const folderLink = await drive.files.get({
              fileId: sessionFolderId,
              fields: "webViewLink",
            });

            // ques folder link
            await drive.permissions.create({
              fileId: questionFolderId,
              requestBody: {
                role: "writer",
                type: "anyone",
              },
            });
            const quesFolderLink = await drive.files.get({
              fileId: questionFolderId,
              fields: "webViewLink",
            });
            console.log({ folderLink: folderLink.data });
            if (folderLink) {
              postData.folderlink = folderLink.data.webViewLink;
            } else {
              console.log("Didn't got folder link");
            }

            console.log({ quesfolderLink: quesFolderLink.data });
            if (quesFolderLink) {
              postData.quesFolderLink = quesFolderLink.data.webViewLink;
            } else {
              console.log("Didn't got ques folder link");
            }

            await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
            drive.files
              .get({
                fileId: fileId,
                fields: "webViewLink,webContentLink",
              })
              .then(async (resUrl) => {
                // console.log({ resUrl });
                // try {
                let weblink = resUrl.data.webViewLink;

                filelink.push(weblink);
                const result = await Session.findOneAndUpdate(
                  { session_id: sessionId },
                  postData,
                  {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                  }
                );
                console.log("result:", result);

                console.log("working session backend");
              });
          });
        }
      }

      // if session folder is not there
      else {
        var createSessioFolder = await drive.files.create({
          resource: {
            name: `Session-${sessionId}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [ClientFolder.id],
          },
          fields: "id",
        });

        let createSolnFolder = await drive.files.create({
          resource: {
            name: `Solutions-${sessionId}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [createSessioFolder.data.id],
          },
          fields: "id",
        });
        await drive.permissions.create({
          fileId: createSolnFolder.data.id,
          requestBody: {
            role: "writer",
            type: "anyone",
            // emailAddress:"shiv7255918@gmail.com"
          },
        });

        var createQuesFolder = await drive.files.create({
          resource: {
            name: `Questions-${sessionId}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [createSessioFolder.data.id],
          },
          fields: "id",
        });

        //UPLOADING FILE INTO GOOGLE DRIVE 2nd

        if (req.files && req.files.length > 0) {
          req.files.forEach(async (file, index, arr) => {
            // fileName = fileName + file.originalname + ",";
            fileName.push(" " + file.originalname);
            const fileBuffer = file.buffer;

            const stream = Readable.from(fileBuffer);
            var response = await drive.files.create({
              requestBody: {
                name: `${file.originalname}_${type}--${clientId}/${sessionId}`,
                mimeType: file.mimeType,
                parents: [createQuesFolder.data.id],
              },
              media: {
                mimeType: file.mimeType,
                body: stream,
              },
            });

            console.log({ DriveData: response.data });
            let fileId = response.data.id;

            let sessionFolderId = createSessioFolder.data.id;
            let questionFolderId = createQuesFolder.data.id;

            await drive.permissions.create({
              fileId: sessionFolderId,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
            const folderLink = await drive.files.get({
              fileId: sessionFolderId,
              fields: "webViewLink",
            });

            // ques folder link
            await drive.permissions.create({
              fileId: questionFolderId,
              requestBody: {
                role: "writer",
                type: "anyone",
              },
            });
            const quesFolderLink = await drive.files.get({
              fileId: questionFolderId,
              fields: "webViewLink",
            });
            console.log({ folderLink: folderLink.data });
            if (folderLink) {
              postData.folderlink = folderLink.data.webViewLink;
            } else {
              console.log("Didn't got folder link");
            }

            console.log({ quesfolderLink: quesFolderLink.data });
            if (quesFolderLink) {
              postData.quesFolderLink = quesFolderLink.data.webViewLink;
            } else {
              console.log("Didn't got ques folder link");
            }

            await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
            drive.files
              .get({
                fileId: fileId,
                fields: "webViewLink,webContentLink",
              })
              .then(async (resUrl) => {
                // console.log({ resUrl });
                // try {
                let weblink = resUrl.data.webViewLink;

                filelink.push(weblink);
                const result = await Session.findOneAndUpdate(
                  { session_id: sessionId },
                  postData,
                  {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                  }
                );
                console.log("result:", result);

                console.log("working session backend");
              });

            // await unlinkAsync(filePath);
            console.log("file deleted from disk");
          });
        } else {
          let sessionFolderId = createSessioFolder.data.id;
          let questionFolderId = createQuesFolder.data.id;

          await drive.permissions.create({
            fileId: sessionFolderId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
          const folderLink = await drive.files.get({
            fileId: sessionFolderId,
            fields: "webViewLink",
          });

          // ques folder link
          await drive.permissions.create({
            fileId: questionFolderId,
            requestBody: {
              role: "writer",
              type: "anyone",
            },
          });
          const quesFolderLink = await drive.files.get({
            fileId: questionFolderId,
            fields: "webViewLink",
          });
          const result = await Session.findOneAndUpdate(
            { session_id: sessionId },
            {
              client_id: clientId,
              session_id: sessionId,
              client_files: fileName,
              client_comments: req.body.client_comments,
              branch: req.body.branch,
              subject: req.body.subject,
              deadline: req.body.date_time,
              client_time: req.body.client_time,
              duration: req.body.duration,
              folderlink: folderLink.data.webViewLink,
              quesFolderLink: quesFolderLink.data.webViewLink,
              country: req.body.country,
              city: req.body.city,
              type: type,
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );
          console.log("result:", result);
          console.log("working session backend");
        }
      }
    } else {
      var createClientFolder = await drive.files.create({
        resource: {
          name: `Client-${clientId}`,
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      var createSessionFolder = await drive.files.create({
        resource: {
          name: `Session-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createClientFolder.data.id],
        },
        fields: "id",
      });

      let createSolnFolder = await drive.files.create({
        resource: {
          name: `Solutions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessionFolder.data.id],
        },
        fields: "id",
      });
      await drive.permissions.create({
        fileId: createSolnFolder.data.id,
        requestBody: {
          role: "writer",
          type: "anyone",
          // emailAddress:"shiv7255918@gmail.com"
        },
      });

      var createQuesFolder = await drive.files.create({
        resource: {
          name: `Questions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessionFolder.data.id],
        },
        fields: "id",
      });

      //UPLOADING FILE INTO GOOGLE DRIVE 3rd

      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file, index, arr) => {
          // fileName = fileName + file.originalname + ",";
          fileName.push(" " + file.originalname);
          const fileBuffer = file.buffer;

          const stream = Readable.from(fileBuffer);
          var response = await drive.files.create({
            requestBody: {
              name: `${file.originalname}_${type}--${clientId}/${sessionId}`,
              mimeType: file.mimeType,
              parents: [createQuesFolder.data.id],
            },
            media: {
              mimeType: file.mimeType,
              body: stream,
            },
          });
          console.log({ DriveData: response.data });

          let fileId = response.data.id;
          let sessionFolderId = createSessionFolder.data.id;
          let questionFolderId = createQuesFolder.data.id;

          await drive.permissions.create({
            fileId: sessionFolderId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
          const folderLink = await drive.files.get({
            fileId: sessionFolderId,
            fields: "webViewLink",
          });

          // ques folder link
          await drive.permissions.create({
            fileId: questionFolderId,
            requestBody: {
              role: "writer",
              type: "anyone",
            },
          });
          const quesFolderLink = await drive.files.get({
            fileId: questionFolderId,
            fields: "webViewLink",
          });
          console.log({ folderLink: folderLink.data });
          if (folderLink) {
            postData.folderlink = folderLink.data.webViewLink;
          } else {
            console.log("Didn't got folder link");
          }

          console.log({ quesfolderLink: quesFolderLink.data });
          if (quesFolderLink) {
            postData.quesFolderLink = quesFolderLink.data.webViewLink;
          } else {
            console.log("Didn't got ques folder link");
          }

          await drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });
          drive.files
            .get({
              fileId: fileId,
              fields: "webViewLink,webContentLink",
            })
            .then(async (resUrl) => {
              // console.log({ resUrl });
              // try {
              let weblink = resUrl.data.webViewLink;

              filelink.push(weblink);
              const result = await Session.findOneAndUpdate(
                { session_id: sessionId },
                postData,
                {
                  upsert: true,
                  new: true,
                  setDefaultsOnInsert: true,
                }
              );
              console.log("result:", result);
              console.log("working session backend");
            });

          // await unlinkAsync(filePath);
          // console.log('file deleted from disk');
        });
      } else {
        // links
        let sessionFolderId = createSessionFolder.data.id;
        let questionFolderId = createQuesFolder.data.id;

        await drive.permissions.create({
          fileId: sessionFolderId,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
        const folderLink = await drive.files.get({
          fileId: sessionFolderId,
          fields: "webViewLink",
        });

        // ques folder link
        await drive.permissions.create({
          fileId: questionFolderId,
          requestBody: {
            role: "writer",
            type: "anyone",
          },
        });
        const quesFolderLink = await drive.files.get({
          fileId: questionFolderId,
          fields: "webViewLink",
        });

        // links end

        const result = await Session.findOneAndUpdate(
          { session_id: sessionId },
          {
            client_id: clientId,
            session_id: sessionId,
            client_files: fileName,
            client_comments: req.body.client_comments,
            branch: req.body.branch,
            subject: req.body.subject,
            deadline: req.body.date_time,
            client_time: req.body.client_time,
            duration: req.body.duration,
            folderlink: folderLink.data.webViewLink,
            quesFolderLink: quesFolderLink.data.webViewLink,
            country: req.body.country,
            city: req.body.city,
            type: type,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        console.log("result:", result);
        console.log("working session backend");
      }
    }

    // webhook response to chat app
    await axios({
      method: "post",
      url: "https://potent-result-348409.el.r.appspot.com/api/newSession",
      data: { session_id: sessionId, client_id: clientId, type: type },
    });

    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log("DRIVE HAVE SOME ERROR");
    console.log({ err });
    res.status(500).json(err);
  }

  console.log({ filelink: filelink });
});

// add session api call
router.post("/addSession", upload.none(), async (req, res) => {
  let clientId = req.body.clientId;
  let sessionId = req.body.sessionId;

  console.log({ sessionId1: sessionId });
  console.log({ clientId1: clientId });

 

  try {
    const result = await Session.findOneAndUpdate(
      { session_id: sessionId },
      {
        client_id: clientId,
        client_comments: req.body.client_comments,
        subject: req.body.subject,
        deadline: req.body.date_time,
        client_time: req.body.client_time,
        duration: req.body.duration,
        country: req.body.country,
        city: req.body.city,
        type: req.body.type,
        university:req.body.university
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // webhook response to chat app
    await axios({
      method: "post",
      url: "https://eduarnochatapp.el.r.appspot.com/api/newSession",
      data: { session_id: sessionId, client_id: clientId, type: req.body.type },
    });

    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log("DRIVE HAVE SOME ERROR");
    console.log({ err });
    res.status(500).json(err);
  }
});

// build folder in google drive
router.post("/folderBuilder", async (req, res) => {
  let clientId = req.body.clientId;
  let sessionId = req.body.sessionId;

  console.log({ sessionId1: sessionId });
  console.log({ clientId1: clientId });

  const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oauth2client,
  });

  try {
    var clientFolderSearch = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='Client-${clientId}'`,
      fields: "files(id,name)",
    });

    console.log({ create3: clientFolderSearch.data.files });

    var ClientFolder = clientFolderSearch.data.files[0];

    if (clientFolderSearch.data.files.length !== 0) {
      // creating session folder
      var createSessioFolder = await drive.files.create({
        resource: {
          name: `Session-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [ClientFolder.id],
        },
        fields: "id",
      });

      // creating solution folder
      let createSolnFolder = await drive.files.create({
        resource: {
          name: `Solutions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessioFolder.data.id],
        },
        fields: "id",
      });

      //taking permissions solution folder
      await drive.permissions.create({
        fileId: createSolnFolder.data.id,
        requestBody: {
          role: "writer",
          type: "anyone",
        },
      });

      // creating questions folder
      var createQuesFolder = await drive.files.create({
        resource: {
          name: `Questions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessioFolder.data.id],
        },
        fields: "id",
      });

      let sessionFolderId = createSessioFolder.data.id;
      let questionFolderId = createQuesFolder.data.id;

      await drive.permissions.create({
        fileId: sessionFolderId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const folderLink = await drive.files.get({
        fileId: sessionFolderId,
        fields: "webViewLink",
      });

      // ques folder link
      await drive.permissions.create({
        fileId: questionFolderId,
        requestBody: {
          role: "writer",
          type: "anyone",
        },
      });
      const quesFolderLink = await drive.files.get({
        fileId: questionFolderId,
        fields: "webViewLink",
      });
      const result = await Session.findOneAndUpdate(
        { session_id: sessionId },
        {
          client_id: clientId,
          session_id: sessionId,
          folderlink: folderLink.data.webViewLink,
          quesFolderLink: quesFolderLink.data.webViewLink,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      console.log("result:", result);
      console.log("working session backend");
    } else {
      var createClientFolder = await drive.files.create({
        resource: {
          name: `Client-${clientId}`,
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      var createSessionFolder = await drive.files.create({
        resource: {
          name: `Session-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createClientFolder.data.id],
        },
        fields: "id",
      });

      let createSolnFolder = await drive.files.create({
        resource: {
          name: `Solutions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessionFolder.data.id],
        },
        fields: "id",
      });
      await drive.permissions.create({
        fileId: createSolnFolder.data.id,
        requestBody: {
          role: "writer",
          type: "anyone",
        },
      });

      var createQuesFolder = await drive.files.create({
        resource: {
          name: `Questions-${sessionId}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [createSessionFolder.data.id],
        },
        fields: "id",
      });

      let sessionFolderId = createSessionFolder.data.id;
      let questionFolderId = createQuesFolder.data.id;

      await drive.permissions.create({
        fileId: sessionFolderId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const folderLink = await drive.files.get({
        fileId: sessionFolderId,
        fields: "webViewLink",
      });

      // ques folder link
      await drive.permissions.create({
        fileId: questionFolderId,
        requestBody: {
          role: "writer",
          type: "anyone",
        },
      });
      const quesFolderLink = await drive.files.get({
        fileId: questionFolderId,
        fields: "webViewLink",
      });

      // links end

      const result = await Session.findOneAndUpdate(
        { session_id: sessionId },
        {
          client_id: clientId,
          session_id: sessionId,
          folderlink: folderLink.data.webViewLink,
          quesFolderLink: quesFolderLink.data.webViewLink,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      console.log("result:", result);
      console.log("working session backend");
    }

    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log("DRIVE HAVE SOME ERROR");
    console.log({ err });
    res.status(500).json(err);
  }
});

// solution access change drive
router.post("/solutionFolderAccess", async (req, res) => {
  var clientId = req.body.clientId;
  var sessionId = req.body.sessionId;
  var status = req.body.sessionStatus;
  // const type = req.body.type;
  console.log({ sessionId1: sessionId });
  console.log({ clientId1: clientId });
  console.log({ sessionStatus: status });
  // try {
  const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oauth2client,
  });

  try {
    var clientFolderSearch = await drive?.files?.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='Client-${clientId}'`,
      fields: "files(id,name)",
    });

    console.log({ create3: clientFolderSearch.data.files });

    var ClientFolder = clientFolderSearch?.data?.files[0];

    // SEARCHING FOR SESSION FOLDER

    if (clientFolderSearch?.data?.files?.length !== 0) {
      var sessionFolderSearch = await drive.files.list({
        q: ` name='Session-${sessionId}' and '${ClientFolder.id}' in parents`,
        fields: "files(id,name)",
      });
      console.log({ sessionisthere: sessionFolderSearch.data.files });

      if (sessionFolderSearch.data.files.length !== 0) {
        var solutionFolderSearch = await drive.files.list({
          q: ` name='Solutions-${sessionId}' and '${sessionFolderSearch.data.files[0].id}' in parents`,
          fields: "files(id,name)",
        });

        console.log({ solnId: solutionFolderSearch.data.files });
        if (solutionFolderSearch.data.files.length !== 0) {
          var childSolutionFolderSearch = await drive.files.list({
            q: `'${solutionFolderSearch.data.files[0].id}' in parents`,
            fields: "files(id,name)",
          });
          if (childSolutionFolderSearch.data.files.length !== 0) {
            let childSolnFiles = childSolutionFolderSearch.data.files;

            console.log({ childSolnFiles });

            if (status != "completed" && status!=="Solution Sent") {
              childSolnFiles?.map(async (el3) => {
                const permit = await drive.permissions.list({
                  fileId: el3.id,
                });
                permit.data.permissions.map(async (el6) => {
                  if (el6.type == "anyone") {
                    await drive.permissions
                      .delete({
                        permissionId: el6.id,
                        fileId: el3.id,
                      })
                      .then(console.log("change to user"));
                  }
                });
              });
              res.status(200).json({
                success: true,
                driveType: "user",
              });
            } else {
              childSolnFiles?.map(async (el3) => {
                await drive.permissions.create({
                  fileId: el3.id,
                  requestBody: {
                    role: "writer",
                    type: "anyone",
                  },
                });
              });

              res.status(200).json({
                success: true,
                driveType: "anyone",
              });
            }
          } else {
            res.status(200).json({ success: false });
            console.log("dont have child soln folder");
          }
        } else {
          res.status(400).json({ success: false });
          console.log("dont have soln folder");
        }
      }
    } else {
      res.status(400).json("No Client folder found");
    }
  } catch (err) {
    console.log("DRIVE HAVE SOME ERROR");

    console.log({ err });
    res.status(500).json({ result: "notSuccess" });
  }

  // console.log({ filelink: filelink });
});

//create new session form
router.post("/createSession", async (req, res) => {
  const newSession = new Session({
    session_id: req.body.session_id,
    client_id: req.body.client_id,
    client_waId: req.body.client_waId,
    client_name: req.body.client_name,
    session_agent: req.body.session_agent,
    // client_amount: req.body.client_amount,
    // currency: req.body.currency,
  });
  try {
    const newSessionSaved = await newSession.save();
    res.status(200).json({ success: true, result: newSessionSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    console.log("session not created");
  }
});

//get session details using client id
router.get("/getSessionDetails/:clientId", async (req, res) => {
  try {
    const sessionsData = await Session.find({ client_id: req.params.clientId });
    res.status(200).json({ success: true, result: sessionsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all sessions datewise
router.get('/getAllSessionsDatewise', async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  let currency = req.query.currency;
  let date_from = req.query.date_from;
  let date_to = req.query.date_to;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  try {
    const sessions = await Session.find({
      deadline: { $gte : new Date(date_from).toISOString(), $lte: new Date(date_to).toISOString() },
      currency: currency
    });
    let sessionsData = sessions.slice(startIndex, endIndex);
    res.status(200).json({ success: true, length: sessions.length, result: sessionsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all sessions
router.get("/getAllSessions", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  try {
    const sessions = await Session.find();
    let sessionsData = sessions.slice(startIndex, endIndex);
    res
      .status(200)
      .json({ success: true, length: sessions.length, result: sessionsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all sessions
router.get("/getAllSessions2", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  try {
    const sessions = await Session.find({});
    let sessionsData = sessions.slice(startIndex, endIndex);
    res
      .status(200)
      .json({ success: true, length: sessions.length, result: sessionsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//get past sessions list with pagination
router.get("/getSessions/past", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    const pastSessions = await Session.find({
      deadline: { $lt: new Date().toISOString() },
    });
    // console.log(moment(new Date()).format("MM/DD/YYYY h:mm A"));

    // const pastSessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) < new Date()
    // );
    const sortedPastSessions = pastSessions
      .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
      .slice(startIndex, endIndex);
    res
      .status(200)
      .json({ length: pastSessions.length, result: sortedPastSessions });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get past session by search
router.get("/getSessions/past/:sessionsearch", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  // const agg = [
  //   {
  //     $search: {
  //       text: {
  //         query: req.params.sessionsearch,
  //         path: [
  //           "client_id",
  //           "session_id",
  //           "subject",
  //           "type",
  //           "country",
  //           "payment_status",
  //           "work_status",
  //           "assigned_tutors.tutor_id",
  //         ],
  //         fuzzy: {
  //           prefixLength: 7,
  //         },
  //       },
  //     },
  //   },
  // ];

  const agg = [
    {
      $search: {
        wildcard: {
          query: "*" + req.params.sessionsearch + "*",
          path: [{"wildcard": "client_id*"}, {"wildcard": "session_id*"}, {"wildcard": "subject*"}, {"wildcard": "type*"}, {"wildcard": "country*"}, {"wildcard": "payment_status*"}, {"wildcard": "work_status*"}, {"wildcard": "assigned_tutors.tutor_id*"}, { "wildcard": "payment_info.id*" },],
          allowAnalyzedField: true
        }
      },
    }
  ];

  try {
    // let sessions = await Session.find({deadline: { $lt : new Date().toISOString() }});
    let pastSessions = await Session.aggregate(agg);
    // const pastSessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) < new Date()
    // );
    const sortedPastSessions = pastSessions
      .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
      .slice(startIndex, endIndex);
    res
      .status(200)
      .json({ length: pastSessions.length, result: sortedPastSessions });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get upcoming sessions list with pagination
router.get("/getSessions/upcoming", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  const today = new Date();
  // to return the date number(1-31) for the specified date
  console.log("today => ", today);
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  try {
    const upcomingSessions = await Session.find({
      deadline: { $gte: new Date(tomorrow).toISOString() },
    });
    // const upcomingSessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) >= tomorrow
    // );
    const sortedUpcomingSessions = upcomingSessions.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
    const resultSessions = sortedUpcomingSessions.slice(startIndex, endIndex);
    res
      .status(200)
      .json({ length: sortedUpcomingSessions.length, result: resultSessions });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get upcoming session by search
router.get("/getSessions/upcoming/:sessionsearch", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  const today = new Date();
  // to return the date number(1-31) for the specified date
  console.log("today => ", today);
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // const agg = [
  //   {
  //     $search: {
  //       text: {
  //         query: req.params.sessionsearch,
  //         path: [
  //           "client_id",
  //           "session_id",
  //           "subject",
  //           "type",
  //           "country",
  //           "payment_status",
  //           "work_status",
  //           "assigned_tutors.tutor_id",
  //         ],
  //         fuzzy: {
  //           prefixLength: 7,
  //         },
  //       },
  //     },
  //   },
  // ];

  const agg = [
    {
      $search: {
        wildcard: {
          query: "*" + req.params.sessionsearch + "*",
          path: [{"wildcard": "client_id*"}, {"wildcard": "session_id*"}, {"wildcard": "subject*"}, {"wildcard": "type*"}, {"wildcard": "country*"}, {"wildcard": "payment_status*"}, {"wildcard": "work_status*"}, {"wildcard": "assigned_tutors.tutor_id*"}, { "wildcard": "payment_info.id*" },],
          allowAnalyzedField: true
        }
      },
    }
  ];

  try {
    // let sessions = await Session.find({deadline: { $gte : new Date(tomorrow).toISOString() }});
    let upcomingSessions = await Session.aggregate(agg);
    // const upcomingSessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) >= tomorrow
    // );
    const sortedUpcomingSessions = upcomingSessions
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(startIndex, endIndex);
    res.status(200).json({
      length: upcomingSessions.length,
      result: sortedUpcomingSessions,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get today's sessions list with pagination
router.get("/getSessions/today", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  const today = new Date();
  // to return the date number(1-31) for the specified date
  console.log("today => ", today);
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  try {
    const todaySessions = await Session.find({
      deadline: {
        $gte: new Date(today).toISOString(),
        $lt: new Date(tomorrow).toISOString(),
      },
    });
    // const todaySessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) < tomorrow && new Date(ssn.deadline) >= today
    // );
    const sortedTodaySessions = todaySessions.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
    const resultSessions = sortedTodaySessions.slice(startIndex, endIndex);
    res
      .status(200)
      .json({ length: sortedTodaySessions.length, result: resultSessions });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get today's session by search
router.get("/getSessions/today/:sessionsearch", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  const today = new Date();
  // to return the date number(1-31) for the specified date
  console.log("today => ", today);
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // const agg = [
  //   {
  //     $search: {
  //       text: {
  //         query: req.params.sessionsearch,
  //         path: [
  //           "client_id",
  //           "session_id",
  //           "subject",
  //           "type",
  //           "country",
  //           "payment_status",
  //           "work_status",
  //           "assigned_tutors.tutor_id",
  //         ],
  //         fuzzy: {
  //           prefixLength: 7,
  //         },
  //       },
  //     },
  //   },
  // ];

  const agg = [
    {
      $search: {
        wildcard: {
          query: "*" + req.params.sessionsearch + "*",
          path: [{"wildcard": "client_id*"}, {"wildcard": "session_id*"}, {"wildcard": "subject*"}, {"wildcard": "type*"}, {"wildcard": "country*"}, {"wildcard": "payment_status*"}, {"wildcard": "work_status*"}, {"wildcard": "assigned_tutors.tutor_id*"}, { "wildcard": "payment_info.id*" },],
          allowAnalyzedField: true
        }
      },
    }
  ];

  try {
    // let sessions = await Session.find({deadline: { $gte : new Date(today).toISOString(), $lt: new Date(tomorrow).toISOString() }});
    let todaySessions = await Session.aggregate(agg);
    // const todaySessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) < tomorrow && new Date(ssn.deadline) >= today
    // );
    const sortedTodaySessions = todaySessions
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(startIndex, endIndex);
    res
      .status(200)
      .json({ length: todaySessions.length, result: sortedTodaySessions });
  } catch (err) {
    res.status(500).json(err);
  }
});

// filter sessions
router.post("/filter/filterSessions", async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    let sessions;
    let filteredSessions;
    if (
      req.body.work_status &&
      req.body.payment_status &&
      req.body.from &&
      req.body.to &&
      req.body.tutor_payment_status
    ) {
      sessions = await Session.find({
        work_status: req.body.work_status,
        payment_status: req.body.payment_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      !req.body.work_status &&
      req.body.payment_status &&
      req.body.from &&
      req.body.to &&
      req.body.tutor_payment_status
    ) {
      sessions = await Session.find({
        payment_status: req.body.payment_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      req.body.work_status &&
      !req.body.payment_status &&
      req.body.tutor_payment_status &&
      req.body.from &&
      req.body.to
    ) {
      sessions = await Session.find({
        work_status: req.body.work_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      !req.body.work_status &&
      !req.body.payment_status &&
      req.body.tutor_payment_status &&
      req.body.from &&
      req.body.to
    ) {
      sessions = await Session.find({
        tutor_payment_status: req.body.tutor_payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      req.body.work_status &&
      req.body.payment_status &&
      req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        work_status: req.body.work_status,
        payment_status: req.body.payment_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
      // filteredSessions = sessions.filter(
      //   (ssn) => new Date(ssn.deadline) >= new Date(req.body.from) && new Date(ssn.deadline) <= new Date(req.body.to)
      // );
    } else if (
      !req.body.work_status &&
      req.body.payment_status &&
      req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        payment_status: req.body.payment_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
    } else if (
      req.body.work_status &&
      !req.body.payment_status &&
      req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        work_status: req.body.work_status,
        tutor_payment_status: req.body.tutor_payment_status,
      });
    } else if (
      !req.body.work_status &&
      !req.body.payment_status &&
      req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        tutor_payment_status: req.body.tutor_payment_status,
      });
    } else if (
      req.body.work_status &&
      req.body.payment_status &&
      req.body.from &&
      req.body.to &&
      !req.body.tutor_payment_status
    ) {
      sessions = await Session.find({
        work_status: req.body.work_status,
        payment_status: req.body.payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      !req.body.work_status &&
      req.body.payment_status &&
      req.body.from &&
      req.body.to &&
      !req.body.tutor_payment_status
    ) {
      sessions = await Session.find({
        payment_status: req.body.payment_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      req.body.work_status &&
      !req.body.payment_status &&
      !req.body.tutor_payment_status &&
      req.body.from &&
      req.body.to
    ) {
      sessions = await Session.find({
        work_status: req.body.work_status,
      });
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      !req.body.work_status &&
      !req.body.payment_status &&
      !req.body.tutor_payment_status &&
      req.body.from &&
      req.body.to
    ) {
      sessions = await Session.find();
      filteredSessions = sessions.filter(
        (ssn) =>
          new Date(ssn.deadline) >= new Date(req.body.from) &&
          new Date(ssn.deadline) <= new Date(req.body.to)
      );
    } else if (
      req.body.work_status &&
      req.body.payment_status &&
      !req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        work_status: req.body.work_status,
        payment_status: req.body.payment_status,
      });
      // filteredSessions = sessions.filter(
      //   (ssn) => new Date(ssn.deadline) >= new Date(req.body.from) && new Date(ssn.deadline) <= new Date(req.body.to)
      // );
    } else if (
      !req.body.work_status &&
      req.body.payment_status &&
      !req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        payment_status: req.body.payment_status,
      });
    } else if (
      req.body.work_status &&
      !req.body.payment_status &&
      !req.body.tutor_payment_status &&
      !req.body.from &&
      !req.body.to
    ) {
      filteredSessions = await Session.find({
        work_status: req.body.work_status,
      });
    }
    // const filteredSessions = sessions.filter(
    //   (ssn) => new Date(ssn.deadline) >= new Date(req.params.from) && new Date(ssn.deadline) <= new Date(req.params.to)
    // );
    const sortedFilteredSessions = filteredSessions
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(startIndex, endIndex);
    res.status(200).json({
      length: filteredSessions.length,
      result: sortedFilteredSessions,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//updated tutor payment status
router.put("/updateTutorPaymentStatus/:sessionId", async (req, res) => {
  try {
    const updatedSession = await Session.updateOne(
      {
        session_id: req.params.sessionId,
      },
      {
        $set: {
          tutor_payment_status: req.body.tutor_payment_status,
        },
      }
    );
    res.status(200).json(updatedSession);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update session status
router.put("/updateSessionStatus/:sessionId", async (req, res) => {
  try {
    const session_ = await Session.findOne({
      session_id: req.params.sessionId,
    });
    const mongoReturn = await session_.update({
      session_id: req.params.sessionId,
      work_status: req.body.status,
    });
    res.status(200).json(mongoReturn);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get sessions api
router.get("/api/v1/getSessions/:sessionsearch", async (req, res) => {
  const agg = [
    {
      $search: {
        text: {
          query: req.params.sessionsearch,
          path: ["session_id", "agent_name"],
          fuzzy: {},
        },
      },
    },
  ];

  try {
    let sessions = await Session.aggregate(agg);
    res.status(200).json(sessions);
  } catch (err) {
    req.status(500).json(err);
  }
});

//get sessionDetail
router.get("/api/v1/getSessionDetail/:sessionId", async (req, res) => {
  try {
    const tutors = await Session.findOne({
      session_id: req.params.sessionId,
    });
    res.status(200).json(tutors);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update notified tutors data
router.post("/updateNotifiedTutors", async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { session_id: req.body.session_id },
      {
        $push: { notified_tutors: req.body.notified_tutors },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: session });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//asign tutors
router.post("/asignTutor", async (req, res) => {
  try {
    const savedSessionTutor = await Session.findOneAndUpdate(
      { session_id: req.body.session_id },
      {
        $push: { assigned_tutors: req.body.assigned_tutor },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: savedSessionTutor });
  } catch (err) {
    res.status(500).json(err);
  }
});

//open session form api
router.get("/openSessionForm/:sessionId/:clientId", async (req, res) => {
  try {
    const session = await Session.findOne({
      session_id: req.params.sessionId,
    });
    if (session.client_id == req.params.clientId) {
      res.status(200).json({ success: true, status: "ok", result: session });
    } else {
      res.status(400).json({ success: false, status: "failed" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// show data of the user in tutor form
router.post("/getTutorFormData", async (req, res) => {
  let clientId = req.body.clientId;
  let sessionId = req.body.sessionId;
  let tutorId = req.body.tutorId;
  console.log(clientId);

  console.log("inside tutorform API ");
  try {
    const result1 = await Session.findOne({ session_id: sessionId });

    if (result1) {
      if (
        result1?.notified_tutors &&
        result1.notified_tutors.find((el) => el.tutor_id == tutorId) &&
        !result1?.notified_tutors.find((el) => el.tutor_id == tutorId)
          ?.cancel_tutor
      ) {
        if (!result1.tutor_interested) {
          let formResult = {
            tutor_dealt_amount: result1.tutor_dealt_amount,
            type: result1.type,
            subject: result1.subject,
            date_time: result1.deadline,
            tutor_deadline: result1.tutor_deadline,
            tutor_duration: result1.tutor_duration,
            duration: result1.duration,
            filelink: result1.filelink,
            folderlink: result1.quesFolderLink,
            client_comments: result1.client_comments,
            success: true,
            // tutorInterested:result1.tutor_interested
          };

          console.log({ formResult: formResult });
          res.status(200).json(formResult);
        } else if (
          !result1.tutor_interested.find((el) => el.tutor_id == tutorId)
        ) {
          let formResult = {
            tutor_dealt_amount: result1.tutor_dealt_amount,
            type: result1.type,
            subject: result1.subject,
            tutor_deadline: result1.tutor_deadline,
            tutor_duration: result1.tutor_duration,
            date_time: result1.deadline,
            duration: result1.duration,
            filelink: result1.filelink,
            folderlink: result1.quesFolderLink,
            client_comments: result1.client_comments,
            tutorInterested: result1.tutor_interested,
            success: true,
          };
          console.log({ formResult: formResult });
          res.status(200).json(formResult);
        } else {
          let tutor_email = result1?.tutor_interested?.find(
            (el1) => el1.tutor_id == tutorId
          )?.email;
          let clientId = result1.client_id;
          let work_status = result1.work_status;

          let formResult = {
            tutor_dealt_amount: result1.tutor_dealt_amount,
            type: result1.type,
            subject: result1.subject,
            tutor_deadline: result1.tutor_deadline,
            tutor_duration: result1.tutor_duration,
            date_time: result1.deadline,
            duration: result1.duration,
            filelink: result1.filelink,
            folderlink: result1.quesFolderLink,
            client_comments: result1.client_comments,
            tutorInterested: result1.tutor_interested,
            tutor_email: tutor_email,
            clientId: clientId,
            work_status: work_status,
            status: "interested",
            success: false,
          };
          console.log({ formResult: formResult });
          console.log("notified and also interested");
          res.send(formResult);
        }
      } else if (
        result1?.notified_tutors &&
        result1.notified_tutors.find((el) => el.tutor_id == tutorId) &&
        result1?.notified_tutors.find((el) => el.tutor_id == tutorId)
          ?.cancel_tutor
      ) {
        let tutor_email = result1?.tutor_interested?.find(
          (el1) => el1.tutor_id == tutorId
        )?.email;
        let clientId = result1.client_id;
        let work_status = result1.work_status;
        res.status(200).json({
          success: false,
          status: "cancelled",
          tutor_email: tutor_email,
          work_status: work_status,
          clientId: clientId,
        });
      } else {
        res.send({ success: false, status: "error" });
        console.log("no notified tutor");
      }
    } else if (!result1) {
      res.send({ success: false, status: "error" });
      console.log("no session");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    console.log("findform not working");
  }
});

// adding child solution folder
router.post("/childSolutionFolderCreate", async (req, res) => {
  var emailId = req.body.emailId;
  let tutorId = req.body.tutorId;
  var clientId = req.body.clientId;
  var sessionId = req.body.sessionId;
  var status = req.body.sessionStatus;
  let assignmentStatus = req.body.assignmentStatus;

  // const type = req.body.type;
  console.log({ sessionId1: sessionId });
  console.log({ clientId1: clientId });
  // console.log({ sessionStatus: status });
  // try {
  const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oauth2client,
  });

  try {
    var clientFolderSearch = await drive?.files?.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='Client-${clientId}'`,
      fields: "files(id,name)",
    });

    console.log({ create3: clientFolderSearch.data.files });

    var ClientFolder = clientFolderSearch?.data?.files[0];

    if (clientFolderSearch?.data?.files?.length !== 0) {
      var sessionFolderSearch = await drive.files.list({
        q: ` name='Session-${sessionId}' and '${ClientFolder.id}' in parents`,
        fields: "files(id,name)",
      });
      console.log({ sessionisthere: sessionFolderSearch.data.files });

      if (sessionFolderSearch?.data?.files?.length !== 0) {
        var solutionFolderSearch = await drive.files.list({
          q: ` name='Solutions-${sessionId}' and '${sessionFolderSearch.data.files[0].id}' in parents`,
          fields: "files(id,name)",
        });

        var childSolutionFolderSearch = await drive.files.list({
          q: ` name='Solutions-${tutorId}' and '${solutionFolderSearch.data.files[0].id}' in parents`,
          fields: "files(id,name)",
        });

        if (childSolutionFolderSearch.data.files.length === 0) {
          if (assignmentStatus === "assigned") {
            await drive.files
              .create({
                resource: {
                  name: `Solutions-${tutorId}`,
                  mimeType: "application/vnd.google-apps.folder",
                  parents: [solutionFolderSearch.data.files[0].id],
                },
                fields: "id",
              })
              .then(async (result1) => {
                await drive.permissions
                  .create({
                    fileId: result1.data.id,
                    requestBody: {
                      role: "writer",
                      type: "user",
                      emailAddress: emailId,
                    },
                  })
                  .then(async (res2) => {
                    const permit = await drive.permissions.list({
                      fileId: result1.data.id,
                    });
                    permit?.data?.permissions?.map(async (el) => {
                      if (el.type == "anyone") {
                        await drive.permissions
                          .delete({
                            permissionId: el.id,
                            fileId: result1.data.id,
                          })
                          .then(console.log("change to user"));
                      }
                    });

                    await drive.files
                      .get({
                        fileId: result1.data.id,
                        fields: "webViewLink",
                      })
                      .then((resUrl) => {
                        let weblink = resUrl.data.webViewLink;

                        res.status(200).json({ solnFolder: weblink });
                      });
                  });
              });
          } else {
            res.status(200).json("unassigned with no solution folder");
          }
        } else {
          if (assignmentStatus === "assigned") {
            await drive.files
              .get({
                fileId: childSolutionFolderSearch.data.files[0].id,
                fields: "webViewLink",
              })
              .then(async (resUrl) => {
                let weblink1 = resUrl.data.webViewLink;

                res.status(200).json({ solnFolder: weblink1 });
              });
          } else {
            await drive.files
              .delete({
                fileId: childSolutionFolderSearch.data.files[0].id,
              })
              .then((resUrl) => {
                res.status(200).json({ success: "del" });
              });
          }
        }
      } else {
        res.status(400).json("No session folder found");
      }
    } else {
      res.status(400).json("No Client folder found");
    }
  } catch (err) {
    console.log("DRIVE HAVE SOME ERROR");
    console.log({ err });
    res.status(500).json({ result: "notSuccess" });
  }
});

// cancel notified tutor
router.put("/cancelNotifiedTutor/:sessionId/:tutorId", async (req, res) => {
  try {
    const updateTutor = await Session.updateOne(
      {
        session_id: req.params.sessionId,
        "notified_tutors.tutor_id": req.params.tutorId,
      },
      { $set: { "notified_tutors.$.cancel_tutor": req.body.status } }
    );
    res.status(200).json({ success: true, result: updateTutor });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/storeTutorResponse", async (req, res) => {
  var tutorId = req.body.tutorId;
  var sessionId = req.body.sessionId;

  // tutor_Interested.push(tutorID)

  let notifiedTut;

  // tutor_Interested.push(tutorID)

  try {
    const result = await Session.findOne({ session_id: sessionId });

    result?.notified_tutors?.forEach((notified) => {
      if (notified.tutor_id === tutorId) {
        notifiedTut = notified;
        console.log({ notifiedTut });
      }
    });

    await axios({
      method: "post",
      url: "https://potent-result-348409.el.r.appspot.com/api/interestedTutors",
      data: { ...notifiedTut, session_id: sessionId },
    });

    const result1 = await Session.updateOne(
      { session_id: sessionId },
      {
        $push: { tutor_interested: notifiedTut },
      }
    );

    if (result1) {
      res.status(200).json({ success: "working tutor intereseted backend" });

      console.log({ success: "working tutor intereseted backend" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    console.log("not_working sessions");
  }
});

//assigned tutor's acceptance status update
router.put(
  "/assigned-tutor-acceptance-status/:sessionId/:tutorId",
  async (req, res) => {
    try {
      const updateTutor = await Session.updateOne(
        {
          session_id: req.params.sessionId,
          "assigned_tutors.tutor_id": req.params.tutorId,
        },
        { $set: { "assigned_tutors.$.acceptance_status": req.body.status } }
      );
      if (updateTutor.n === 1)
        res.status(200).json({ success: true, result: updateTutor });
      else {
        res.status(200).json({ success: false, result: updateTutor });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//unassign tutor from assigned tutors list
router.put("/unassign-tutor/:sessionId/:tutorId", async (req, res) => {
  try {
    const updateTutor = await Session.updateOne(
      {
        session_id: req.params.sessionId,
        "assigned_tutors.tutor_id": req.params.tutorId,
      },
      { $set: { "assigned_tutors.$.tutor_unassigned": req.body.status } }
    );
    res.status(200).json({ success: true, result: updateTutor });
  } catch (err) {
    res.status(500).json(err);
  }
});

//new payment link api
router.post("/new-payment-link", async (req, res) => {
  axios({
    method: "post",
    url: "https://api.razorpay.com/v1/payment_links",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        base64.encode(req.headers["username"] + ":" + req.headers["password"]),
    },
    data: {
      amount: +req.body.amount,
      currency: req.body.currency,
      accept_partial: true,
      first_min_partial_amount: 100,
      expire_by: Math.floor(new Date().getTime() / 1000.0) + 604800,
      reference_id: req.body.reference_id,
      description: "Payment for session/assignment",
      customer: {
        name: "Gaurav Kumar",
        contact: "+919999999999",
        email: "gaurav.kumar@example.com",
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        note_key: "payment receive",
        session_id: req.body.session_id
      },
      callback_method: "get",
      options: {
        checkout: {
          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay using Cards",
                  instruments: [
                    {
                      method: "upi",
                    },
                    {
                      method: "netbanking",
                    },
                    {
                      method: "card",
                    },
                    {
                      method: "wallet",
                    },
                    {
                      method: "bank_transfer",
                    },
                  ],
                },
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: req.body.show_default_blocks,
              },
            },
          },
        },
      },
    },
  })
    .then(async (response) => {
      try {
        const savedSession = await Session.findOneAndUpdate(
          { session_id: req.body.session_id },
          {
            plink_id: response?.data?.id,
            client_amount: req.body.amount,
            currency: req.body.currency,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        res
          .status(200)
          .json({ success: true, result: response?.data?.short_url });
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify("ok");
    })
    .catch(function (error) {
      console.log(error);
    });
});

//fetch payment link api
router.get("/fetch-payment-link/:plink_id", async (req, res) => {
  axios({
    method: "get",
    url: `https://api.razorpay.com/v1/payment_links/${req.params.plink_id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        base64.encode(req.headers["username"] + ":" + req.headers["password"]),
    },
  })
    .then(async (response) => {
      try {
        res.status(200).json({ result: response?.data });
      } catch (err) {
        res.status(500).json(err);
      }
      return JSON.stringify("ok");
    })
    .catch(function (error) {
      console.log(error);
    });
});

//save payment details received from clients
router.post("/refreshPaymentInfo", async (req, res) => {
  try {
    console.log({ sessionIdTest: req.body.session_id });
    const paymentIdAr = req.body.paymentIdAr;
    console.log({ paymentIdAr });
    paymentIdAr?.map(async (el1) => {
      const fetchSession1 = await Session.findOne({
        session_id: req.body.session_id,
      });
      console.log({fetchSession1:fetchSession1.payment_info})
      if (
         !fetchSession1?.payment_info || fetchSession1?.payment_info?.length===0 || fetchSession1?.payment_info?.filter((el) => el.id === el1.payment_id)?.length === 0  
        // || fetchSession1?.payment_info===undefined
      ) {
        let config = {
          method: "get",
          url: `https://api.razorpay.com/v1/payments/${el1.payment_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              base64.encode(
                req.headers["username"] + ":" + req.headers["password"]
              ),
          },
        };

        axios(config)
          .then(async (response) => {
            const savedSessionPay = await Session.updateOne({
                session_id: req.body.session_id,
              },
              {
              $push: { payment_info: { ...response.data, type: el1.type } },
              payment_status: req.body.payment_status,
            });

            console.log({responseTest:response})
          })
          .catch(function (error) {
            res.status(500).json(error);
            console.log({ error });
          });
      }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
    console.log({ err });
  }
});

//save payment details received from clients
router.post("/savePaymentInfo", async (req, res) => {
  try {
    const savedSessionPay = await Session.findOneAndUpdate(
      { plink_id: req.body.plink_id },
      // {  },
      {
        $push: { payment_info: req.body.payment_info },
        // payment_info: {
        //   $push: {[req.body.plink_id]: req.body.payment_info[req.body.plink_id]}
        // },
        // payment_info: {[req.body.plink_id]: [...payment_info[req.body.plink_id], req.body.payment_info]},
        payment_status: req.body.payment_status,
        // { $push: { scores: 89 } }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: savedSessionPay });
  } catch (err) {
    res.status(500).json(err);
  }
});

//save payment details received from clients in virtual account
router.post("/savePaymentInfo-vpa", async (req, res) => {
  try {
    const savedSessionPay = await Session.findOneAndUpdate(
      { va_id: req.body.va_id },
      // {  },
      {
        $push: { payment_info: req.body.payment_info },
        payment_status: "partially_paid",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: savedSessionPay });
  } catch (err) {
    res.status(500).json(err);
  }
});

// save agent comment in session
router.put("/saveAgentComment", async (req, res) => {
  try {
    const session_cmnt = await Session.findOneAndUpdate(
      { session_id: req.body.session_id },
      {
        $push: { agent_comments_new: req.body.agent_comments },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: session_cmnt });
  } catch (err) {
    res.status(500).json(err);
  }
});

//tutor razorpay payment status update
router.put(
  "/update-tutor-payment-status/:sessionId/:waId/:poutId",
  async (req, res) => {
    try {
      const updateTutorPayment = await Session.updateOne(
        {
          session_id: req.params.sessionId,
          "assigned_tutors.wa_id": req.params.waId,
        },
        // { $push: { "assigned_tutors.$.pout_info" : req.body } }
        { $set: { "assigned_tutors.$.pout_info.$[element]": req.body } },
        { arrayFilters: [{ "element.id": req.params.poutId }] }
      );
      res.status(200).json({ success: true, result: updateTutorPayment });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//tutor dealt amount update
router.put("/update-tutor-amount", async (req, res) => {
  try {
    const session_tutorAmt = await Session.findOneAndUpdate(
      { session_id: req.body.session_id },
      {
        tutor_dealt_amount: req.body.tutor_dealt_amount,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: session_tutorAmt });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update amount in assigned tutor
router.put("/assignedTutorUpdateAmount", async (req, res) => {
  try {
    const session_tutorAmt = await Session.updateOne(
      {
        session_id: req.body.session_id,
        "assigned_tutors.tutor_id": req.body.tutor_id,
      },
      {
        $set: {
          "assigned_tutors.$.tutor_dealt_amount": req.body.tutor_dealt_amount,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    res.status(200).json({ success: true, result: session_tutorAmt });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
});

//active/inactive paypal link of session
router.put("/active-inactive-paypal_link/:sessionId", async (req, res) => {
  try {
    const session_paypallink = await Session.findOneAndUpdate(
      { session_id: req.params.sessionId },
      {
        show_paypal_url: req.body.show_paypal_url,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    res.status(200).json({ success: true, result: session_paypallink });
  } catch (err) {
    res.status(500).json(err);
  }
});

//tutors' session rating
router.put("/tutor-session-rating/:tutorId/:sessionId", async (req, res) => {
  let newRating = req.body.rating;
  try {
    // const tutor = await TutorSchema.findOne({ tutor_id: req.params.tutorId });
    // if (tutor.rating) newRating = (+newRating + +tutor.rating) / 2;

    // const mongoReturn = await tutor.update({
    //   rating: '' + newRating,
    //   $push: { sessions_done: req.body.session_done }
    // });
    const tutor = await Session.findOne({
      session_id: req.params.sessionId,
      "assigned_tutors.tutor_id": req.params.tutorId,
    });
    if (
      tutor.assigned_tutors.filter((el2)=>el2.tutor_id===req.params.tutorId)[0].rating &&
      tutor.assigned_tutors.filter((el2)=>el2.tutor_id===req.params.tutorId)[0].rating.length !== 0
    )
    newRating = (+newRating + +tutor.assigned_tutors.filter((el2)=>el2.tutor_id===req.params.tutorId)[0].rating) / 2;

    let ratingObj = {
      sessionId: req.body.session_done,
      rating: "" + newRating,
      speed: req.body.speed,
      accuracy: req.body.accuracy,
      legitimacy: req.body.legitimacy,
      reviews: req.body.reviews,
    };
    // console.log({tutorObj:tutor?.assigned_tutors?.filter(el=>el.tutor_id===req.params.tutorId)[0]?.rating_and_reviews?.filter(el1=>el1.sessionId===req.body.session_done),tut123:tutor?.assigned_tutors?.filter(el=>el.tutor_id===req.params.tutorId)})
    if (
      !tutor?.assigned_tutors?.filter(
        (el) => el.tutor_id === req.params.tutorId
      )[0]?.rating_and_reviews
    ) {
      const updateTutorRating = await Session.updateOne(
        {
          session_id: req.params.sessionId,
          "assigned_tutors.tutor_id": req.params.tutorId,
        },
        {
          $set: { "assigned_tutors.$.rating_and_reviews": [] },
        },
        {
          upsert: true,
          new: true,
        }
      );
      if (updateTutorRating) {
        const updatetut = await Session.updateOne(
          {
            session_id: req.params.sessionId,
            "assigned_tutors.tutor_id": req.params.tutorId,
          },
          {
            $set: {
              "assigned_tutors.$.session_rating": req.body.session_rating,
              "assigned_tutors.$.rating": "" + newRating,
            },
            $push: {
              "assigned_tutors.$.rating_and_reviews": ratingObj,
              "assigned_tutors.$.sessions_done": req.body.session_done,
            },
          }
        );
        res
          .status(200)
          .json({ session: updatetut, success: "New array field" });
      } else {
        res.status(400).json("rating_and_review field error!");
      }
    } else if (
      tutor?.assigned_tutors
        ?.filter((el) => el.tutor_id === req.params.tutorId)[0]
        ?.rating_and_reviews?.filter(
          (el1) => el1.sessionId === req.body.session_done
        )?.length !== 0
    ) {
      const updateTutorRating = await Session.updateOne(
        {
          session_id: req.params.sessionId,
          "assigned_tutors.tutor_id": req.params.tutorId,
        },
        {
          $set: {
            "assigned_tutors.$.session_rating": req.body.session_rating,
            "assigned_tutors.$.rating": "" + newRating,
            "assigned_tutors.$.rating_and_reviews.$[temp]": ratingObj
          },
          // $set:{"assigned_tutors.$.rating_and_reviews.$[temp].rating":'' + newRating,"assigned_tutors.$.rating_and_reviews.$[temp].speed":req.body.speed}
          
        },
        {
          arrayFilters: [{ "temp.sessionId": req.body.session_done }],
          upsert: true,
        }
      );
      res.status(200).json({ session: updateTutorRating, success: "Old Data" });
    } else {
      const updateTutorRating = await Session.updateOne(
        {
          session_id: req.params.sessionId,
          "assigned_tutors.tutor_id": req.params.tutorId,
        },
        {
          $set: {
            "assigned_tutors.$.session_rating": req.body.session_rating,
            "assigned_tutors.$.rating": "" + newRating,
          },
          $push: {
            "assigned_tutors.$.rating_and_reviews": ratingObj,
            "assigned_tutors.$.sessions_done": req.body.session_done,
          },
        },
        {
          upsert: true,
        }
      );
      res.status(200).json({ session: updateTutorRating, success: "New Data" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log({ err });
  }
});

router.put("/update-session-payment-status", async (req, res) => {
  try {
    const updateSessionPayment = await Session.updateOne(
      { session_id: req.body.sessionId },
      { $set: { payment_status: req.body.payment_status } }
    );
    res.status(200).json({ success: true, result: updateSessionPayment });
  } catch (err) {
    res.status(500).json(err);
  }
});

// set tutor deadline
router.put("/set-tutor-deadline", async (req, res) => {
  try {
    const updateTutorDeadline = await Session.updateOne(
      { session_id: req.body.sessionId },
      {
        $set: {
          tutor_deadline: req.body.tutor_deadline,
          tutor_duration: req.body.tutor_duration,
        },
      }
    );
    res.status(200).json({ success: true, result: updateTutorDeadline });
  } catch (err) {
    res.status(500).json(err);
  }
});

// whatsapp number validation for tutor intereted form
router.post("/validateWaNumber", async (req, res) => {
  try {
    const tutorId = req.body.tutorId;
    const waNumber = req.body.waNumber;
    const result1 = await Session.findOne({ session_id: req.body.sessionId });

    if (result1) {
      if (
        result1?.notified_tutors &&
        result1.notified_tutors.find(
          (el) => el.tutor_id == tutorId && el.wa_id == waNumber
        )
      ) {
        console.log({ waNumber: result1 });
        res.status(200).json({ success: true });
      } else {
        res.send({ success: false });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//send email notification to tutors
router.post("/tutorEmailNotification", async (req, res) => {
  try {
    // sending mail to tutor
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "livetutors365@gmail.com",
        pass: "ccqzwyhgsjdsogpi",
      },
    });

    let mailOptions = {
      from: "tutorpointdevice1@gmail.com",
      to: req.body.email,
      subject: `${req.body.param1} | ${req.body.param3}`,
      html: `<center><img src="https://tutorpoint.in/assets/images/logo.png" style="width: 125px" /></center><br /><br /><p><b>Dear ${
        req.body.name
      },</b></p><p>We have a session for you.</p><p>Session ID: ${
        req.body.param2
      }</p><p>Subject/Topic name: ${req.body.param3}</p><p>Date and Time ${
        req.body.templateName.includes("live_session_tutor_notify")
          ? ""
          : "(Deadline)"
      }: ${req.body.param4}</p><p>Duration: ${
        req.body.templateName.includes("live_session_tutor_notify")
          ? req.body.param5
          : "N/A"
      }</p><p>We will pay you ${
        req.body.param6
      }</p><p>Are you confident in this subject? Can you perform very well in this session? If yes, then press on the below button to show your interest. Please check the study materials after you press the button below.</p><button style='background-color: #59C173; padding: 10px 18px; border: 1px solid #59C173; border-radius: 20px'><a href="https://tutor-response.tutorpoint.in/${
        req.body.param7
      }" target="_blank" style='text-decoration: none; color: #ffff'>I am Interested</a></button><p>Please wait after you show your interest. We will get back to you shortly to get your confirmation for this session. 
      Disclaimer:</p><p><b>1.Never take these sessions casually. They impact your ratings.</b></p><p><b>2. Showing interest doesn't mean that we have assigned the session to you.</b></p><p>To stop receiving Whatsapp notifications from us, send an official email to us.</p><br /><p>Thanks,</p><p>Team Tutorpoint</p><p>Email: support@tutorpoint.in, Contact: +917761093194</p><br/><br /><footer><p>Copyright © 2020 Tutorpoint. All rights reserved Abhay Education Pvt. Ltd.</p></footer>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    if (req.body.medium == "mail") {
      const updateSession = await Session.findOneAndUpdate(
        { session_id: req.body.sessionId },
        {
          $push: { notified_tutors: req.body.notified_tutors },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      console.log(updateSession);
    }

    // const updateTutor = await Session.updateOne(
    //   { session_id: req.body.sessionId, "notified_tutors.tutor_id": req.body.tutorId },
    //   { $set: { "notified_tutors.$.medium" : 'wa-mail' } }
    // );

    res.status(200).json("Email sent");
  } catch (err) {
    console.log(err);
    res.status(500).json("Email not sent");
  }
});

//send mail notification to tutors to assign session
router.post("/tutorAssignMailNotification", async (req, res) => {
  try {
    // sending assigned session mail to tutor
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "livetutors365@gmail.com",
        pass: "ccqzwyhgsjdsogpi",
      },
    });

    let mailOptions = {
      from: "tutorpointdevice1@gmail.com",
      to: req.body.email,
      subject: `${req.body.param1} | Tutorpoint`,
      html: `<center><img src="https://tutorpoint.in/assets/images/logo.png" style="width: 125px" /></center><br /><br /><p><b>Dear ${req.body.param2},</b></p><p>We have assigned a Live session with Session ID: ${req.body.param3} to you. You had shown interest for this session. So Please click on the button below to accept it. </p><p><b>Accepting a Live session means you take responsibility to attend the Live session on time. You will do all the preparations beforehand only by studying all the study materials.</b></p><p><b>Poor performance in Live Sessions will impact your ratings. Maintain high ratings to receive more work from us.</b></p><button style='background-color: #59C173; padding: 10px 18px; border: 1px solid #59C173; border-radius: 20px'><a href="https://tutor-response.tutorpoint.in/${req.body.param4}" target="_blank" style='text-decoration: none; color: #ffff'>Accept Session</a></button><p>To stop receiving Whatsapp notifications from us, send an official email to us.</p><br /><p>Thanks,</p><p>Team Tutorpoint</p><p>Email: support@tutorpoint.in, Contact: +917761093194</p><br/><br /><footer><p>Copyright © 2020 Tutorpoint. All rights reserved Abhay Education Pvt. Ltd.</p></footer>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json("Email sent");
  } catch (err) {
    res.status(500).json("Email not sent");
  }
});

// cancel tutor
router.put("/cancel-tutor/:sessionId/:tutorId", async (req, res) => {
  try {
    const updateTutor = await Session.updateOne(
      {
        session_id: req.params.sessionId,
        "assigned_tutors.tutor_id": req.params.tutorId,
      },
      { $set: { "assigned_tutors.$.tutor_cancelled": req.body.status } }
    );
    res.status(200).json({ success: true, result: updateTutor });
    console.log({ updateTutor });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get clients
router.get("/getClients", async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json(err);
  }
});

// set tutor deadline
router.get("/updateDeadlineFormat/", async (req, res) => {
  try {
    const findDeadline = await Session.find();
    console.log({ findDeadline });
    findDeadline.map(async (el) => {
      if (el.deadline) {
        const updateDeadlineFormat = await Session.updateOne(
          { session_id: el.session_id },
          { deadline: new Date(el.deadline).toISOString() }
        );
      }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
    console.log({ err });
  }
});

module.exports = router;
