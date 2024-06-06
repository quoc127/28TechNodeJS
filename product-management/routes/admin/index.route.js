const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productdRoutes = require("./product.route");
const productCategorydRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  
  app.use(PATH_ADMIN + "/products", productdRoutes);

  app.use(PATH_ADMIN + "/products-category", productCategorydRoutes);

  app.use(PATH_ADMIN + "/roles", roleRoutes);

  app.use(PATH_ADMIN + "/accounts", accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

};
