const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/products-test");

const Product = mongoose.model("Product", {
  title: String,
  price: Number,
  thumbnail: String
});

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.pug", { 
    titlePage: "Trang chủ", 
    message: "Xin chào các bạn" 
  });
});

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  res.render("products.pug", { 
    titlePage: "trang danh sách sản phẩm",
    products: products
  });
});

app.get("/blog", (req, res) => {
  res.send("<h1>Trang danh sách bài viết</h1>");
});

app.get("/contact", (req, res) => {
  res.render("contact.pug", {
    titlePage: "Trang liên hệ",
    message: "Xin chào các bạn",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
