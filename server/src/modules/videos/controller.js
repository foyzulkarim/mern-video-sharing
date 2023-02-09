const { validate } = require("./request");
const { upload } = require("./upload-handler");

const BASE_URL = `/api/videos`;

// Our custom middleware to handle the file upload. We can also use the multer middleware directly in the route handler. But I am using a custom middleware here and moved multer specific code to another file to keep the code clean and easy to understand.
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: "error", error: err });
    }
    next();
  });
};

// This `setupRoutes` is a convention I will be using in this project. I will be exporting a function from each module and will be calling this function in the `server/src/app.js` file. This function will take the express application as an argument and will setup the routes for the module. This will keep the code clean and easy to understand.
const setupRoutes = (app) => {
  app.post(`${BASE_URL}/upload`, uploadMiddleware, async (req, res) => {
    try {
      const payload = { ...req.body };
      const validationResult = validate(payload);
      if (validationResult.error) {
        return res.status(400).json({
          status: "error",
          error: validationResult.error.details[0].message,
        });
      }
      console.log("payload", payload);
      res
        .status(200)
        .json({ status: "success", message: "Upload success", ...req.file });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  });
};

module.exports = { setupRoutes };
