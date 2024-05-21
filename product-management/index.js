const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
require("dotenv").config();
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Method override
const methodOverride = require("method-override");
app.use(methodOverride('_method'))

// Database
const database = require("./config/database.js");
database.connect();

// Pug engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// use files in public folder
app.use(express.static(`${__dirname}/public`));

// App Locals Variables
const systemConfig = require("./config/system.js");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Support parsing of application/json type post data
app.use(bodyParser.json());

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Express Flash
app.use(cookieParser('sfsdfSFS123'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
