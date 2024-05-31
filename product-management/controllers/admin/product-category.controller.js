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
    const data = await ProductCategory.find(find);
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);


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

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const data = await ProductCategory.findOne(find);

  res.render("admin/pages/products-category/detail.pug", {
    pageTitle: data.title,
    data: data,
  });
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id, });
  try {
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Xóa thành công sản phẩm!");
  } catch (error) {
    console.error(error);
    req.flash("error", "Xóa sản phẩm thất bại!");
  }

  res.redirect("back");
};

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trạng thái thất bại!");
  }

  res.redirect("back");
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMultiStatus = async (req, res) => {
  const type = req.body.type;
  console.log(req.body);
  console.log(req.body.type);
  const ids = req.body.ids.split(", ");

  try {
    switch (type) {
      case "active":
        try {
          await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
          );
        } catch (error) {
          console.error(error);
          req.flash(
            "error",
            "Đã xảy ra lỗi trong quá trình cập nhật trạng thái active."
          );
        }
        break;
      case "inactive":
        try {
          await ProductCategory.updateMany(
            { _id: { $in: ids } },
            { status: "inactive" }
          );
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
          );
        } catch (error) {
          console.error(error);
          req.flash(
            "error",
            "Đã xảy ra lỗi trong quá trình cập nhật trạng thái inactive."
          );
        }
        break;
      case "delete-all":
        try {
          await ProductCategory.updateMany(
            { _id: { $in: ids } },
            { deleted: true, deletedAt: new Date() }
          );
          req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
        } catch (error) {
          console.error(error);
          req.flash("error", "Đã xảy ra lỗi trong quá trình xóa sản phẩm.");
        }
        break;
      case "change-position":
        try {
          for (const item of ids) {
            let [id, position] = item.split("-");
            position = parseInt(position);
            await ProductCategory.updateOne({ _id: id }, { position: position });
          }
          req.flash(
            "success",
            `Đã đổi vị trí thành công ${ids.length} sản phẩm!`
          );
        } catch (error) {
          console.error(error);
          req.flash(
            "error",
            "Đã xảy ra lỗi trong quá trình thay đổi vị trí sản phẩm."
          );
        }
        break;
      default:
        req.flash("error", "Loại thao tác không hợp lệ!");
        break;
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi không xác định.");
  }

  res.redirect("back");
};