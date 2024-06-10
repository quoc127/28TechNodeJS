const Products = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Products.find({
    deleted: false,
    featured: "1",
    status: "active",
  });

  productsHelper.priceNewProducts(productsFeatured);
  
  res.render("client/pages/home/index.pug", {
    pageTitle: "trang chủ",
    productsFeatured: productsFeatured,
  });
};
