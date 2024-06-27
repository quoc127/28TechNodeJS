const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
const methodOverride = require("method-override");
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const { Server } = require("socket.io");
const http = require('http');

// Method override
app.use(methodOverride("_method"));

// Database
database.connect();

// Pug engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// use files in public folder
app.use(express.static(`${__dirname}/public`));

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Support parsing of application/json type post data
app.use(bodyParser.json());

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser("sfsdfSFS123"));

// Express Session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Thời gian tồn tại của cookie (60 giây)
  })
);

// Express Flash
app.use(flash());

// Routes
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404",{
    pageTitle: "404 Not Found",
  });
});

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// Start server
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
