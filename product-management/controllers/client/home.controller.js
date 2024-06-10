const Products = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  // Get list products featured
  const productsFeatured = await Products.find({
    deleted: false,
    featured: "1",
    status: "active",
  });

  productsHelper.priceNewProducts(productsFeatured);

  // Get the latest products list
  const productsNew = await Products.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc"}).limit(6);

  productsHelper.priceNewProducts(productsNew);
  
  res.render("client/pages/home/index.pug", {
    pageTitle: "trang chủ",
    productsFeatured: productsFeatured,
    productsNew: productsNew
  });
};
