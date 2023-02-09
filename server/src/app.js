// explain the above code above each of the statements

// 1. Importing the express module.
const express = require("express");

// 2. Importing the compression module. 
const compression = require("compression");

// 3. Importing the cors module.
const cors = require("cors");

// 4. Creating an express application. This is used to create an express application.
const app = express();

// 5. `express.json()` function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

// 6. `compression()` function performs the compression of the response body to the client to reduce the size of the response body.
app.use(compression());

// 7. `cors()` function is used to enable CORS with various options. This is used to accept requests from the client which will be running in different host or port (in local).
app.use(cors());

// 8. Export the app object to be used in other modules.
module.exports = app;


