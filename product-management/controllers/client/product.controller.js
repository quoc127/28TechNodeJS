module.exports.index = (req, res) => {
  res.render("client/pages/products/index.pug", {
    pageTitle: "danh sách sản phẩm"
  });
}