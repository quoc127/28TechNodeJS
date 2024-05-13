const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
require("dotenv").config();
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Method override
const methodOverride = require("method-override");
app.use(methodOverride('_method'))

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
