// Explain the code below above the each of the statements

// 1. Importing the express object.
const app = require("./app");

// 2. Creating a port variable and assigning it to 4000. We will import the port from the .env file later on.
const PORT = 4000;

// 3. `app.listen()` function is used to start the server. It takes two arguments, the port number and a callback function. The callback function is executed when the server starts.
app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);

  // 4. Importing the videos module and calling the `setupRoutes` function. This function will setup the routes for the videos module. We will be refactoring and make it more dynamic and generic later of this series.
  const { setupRoutes } = await require("./modules/videos/controller");
  setupRoutes(app);

  app.use("/", (req, res) => {
    console.log(`request received at ${new Date()}`);
    res.send(`Handled in root (/) URL at ${new Date()}`);
  });

  console.log("application started", new Date().toTimeString());
});
