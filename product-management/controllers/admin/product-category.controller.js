const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const searchrStatusHelper = require("../../helpers/search");


// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };
    // Search function
    const objectSearch = searchrStatusHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }
    console.log(find);
    const data = await ProductCategory.find(find);
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    console.log("newRecords", newRecords);

    res.render("admin/pages/products-category/index.pug", {
      pageTitle: "Danh mục sản phẩm",
      records: find.title ? data : newRecords,
      keyword: objectSearch.keyword,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position == "") {
      const countProductsCategory = await ProductCategory.countDocuments();
      req.body.position = countProductsCategory + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Tạo danh mục thành công!");
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo danh mục thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    console.log(error);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body);

    req.flash("success", "Chỉnh sửa danh mục thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo danh mục thất bại!");
  }
};
