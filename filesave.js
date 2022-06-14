const multer = require("multer");
const path = require("path");

// var storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'uploads/')
//     },

var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
    //  console.log({filelocalstorage:file})
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
    console.log({ fileName: file.originalname });
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/zip" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "application/msword" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype == "application/vnd.ms-excel" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype == "application/vnd.ms-powerpoint" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      file.mimetype == "application/vnd.rar" ||
      file.mimetype == "application/x-rar-compressed" ||
      file.mimetype == "application/x-rar" ||
      file.mimetype == "application/x-7z-compressed" ||
      file.mimetype == "application/x-7z" ||
      file.mimetype == "application/x-bzip2" ||
      file.mimetype == "application/x-bzip" ||
      file.mimetype == "application/x-gzip" ||
      file.mimetype == "application/x-tar" ||
      file.mimetype == "application/x-compressed" ||
      file.mimetype == "application/x-zip-compressed" ||
      file.mimetype == "application/x-zip"
    ) {
      callback(null, true);
    } else {
      console.log("only pdf,doc,png and jpg file is valid");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = upload;