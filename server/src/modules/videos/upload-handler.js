const multer = require("multer");

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const options = {
  storage: multer.diskStorage({
    // We can set the destination folder here. But for simplicity I assume this folder is already here just inside of the server folder. Please make these folders manually if they are not there.
    destination: (_1, _2, cb) => cb(null, "uploads/videos"),

    // We can set and customize the filename here. We can also set the prefix and suffix with the appropriate extensions. But I am just trying to keep it simple here.
    filename: (_, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
  // We can handle the file type here. I am only allowing mp4 and mkv files here and throw an error if the file type is not either of these. We will handle this error in the controller.
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/x-matroska") {
      cb(null, true);
    } else {
      cb(new multer.MulterError("File type not supported"), false);
    }
  },
  // We can set the file size limit here. I am setting it to 100 MB here. Multer will throw error if file size is greater than this limit. We will handle the error in the controller.
  limits: { fileSize: MAX_FILE_SIZE },
};

// important: thiss `video` is the name of the input field in the form. If you change the name of the input field in the form, you need to change it here as well.
// Multer also support multiple file uploads. You can check the documentation for that.
const upload = multer(options).single("video");

module.exports = { upload };
