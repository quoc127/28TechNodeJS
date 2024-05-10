const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchrStatusHelper = require("../../helpers/search")


// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Filter function
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false,
  };
  
  if (req.query.status) {
    find.status = req.query.status;
  }
  console.log(req.query.status);

  // Search function
  const objectSearch = searchrStatusHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
 

  const products = await Product.find(find);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};
