const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchrStatusHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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

  // Search function
  const objectSearch = searchrStatusHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProduct = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProduct
  );
  // End Pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
