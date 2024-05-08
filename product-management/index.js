const express = require("express");
require("dotenv").config();

const route = require("./routes/client/index.route");

const database = require("./config/database.js");
database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// use files in public folder
app.use(express.static("public"));

// Routes
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
