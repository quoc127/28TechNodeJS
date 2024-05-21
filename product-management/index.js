const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
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

// Cookie Parser
app.use(cookieParser('sfsdfSFS123'));

// Express Session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // Thời gian tồn tại của cookie (60 giây)
}));

// Express Flash
app.use(flash());

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
route(app);
routeAdmin(app);

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
