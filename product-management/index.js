const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
route(app);
routeAdmin(app);

// Database
const database = require("./config/database.js");
database.connect();

// Pug engine
app.set("views", "./views");
app.set("view engine", "pug");

// use files in public folder
app.use(express.static("public"));

// App Locals Variables
const systemConfig = require("./config/system.js");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
