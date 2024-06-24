const ProductCategory = require("../../models/product-category.model")
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProducts: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    products: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  }
  statistic.categoryProducts.total = await ProductCategory.countDocuments({ deleted: false })
  statistic.categoryProducts.active = await ProductCategory.countDocuments({ status: "active",deleted: false })
  statistic.categoryProducts.inactive = await ProductCategory.countDocuments({ status: "inactive",deleted: false })
  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
}