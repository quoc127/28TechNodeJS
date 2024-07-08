const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchrStatusHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

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

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Get creator infomation
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    if (user) {
      product.accountFullName = user.fullName;
    }

    // Get editor infomation
    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMultiStatus = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  try {
    switch (type) {
      case "active":
        try {
          await Product.updateMany(
            { _id: { $in: ids } },
            {
              status: "active",
              $push: { updatedBy: updatedBy },
            }
          );
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
          );
        } catch (error) {
          console.error(error);
          req.flash(
            "error",
            "Đã xảy ra lỗi trong quá trình cập nhật trạng thái hoạt động."
          );
        }
        break;
      case "inactive":
        try {
          await Product.updateMany(
            { _id: { $in: ids } },
            {
              status: "inactive",
              $push: { updatedBy: updatedBy },
            }
          );
          req.flash(
            "success",
            `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
          );
        } catch (error) {
          console.error(error);
          req.flash(
            "error",
            "Đã xảy ra lỗi trong quá trình cập nhật trạng thái dừng hoạt động."
          );
        }
        break;
      case "delete-all":
        try {
          await Product.updateMany(
            { _id: { $in: ids } },
            {
              deleted: true,
              deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
              },
            }
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
            await Product.updateOne(
              { _id: id },
              {
                position: position,
                $push: { updatedBy: updatedBy },
              }
            );
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

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id, });
  try {
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", "Xóa thành công sản phẩm!");
  } catch (error) {
    console.error(error);
    req.flash("error", "Xóa sản phẩm thất bại!");
  }

  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  try {
    if (req.body.position == "") {
      const productPositon = await Product.findOne().sort({ position: -1 })
      req.body.position = productPositon.position + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = { account_id: res.locals.user.id };

    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Tạo sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo sản phẩm thất bại!");
    res.redirect("back");
  }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);

    const category = await ProductCategory.find({ deleted: false });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    console.error(error);
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
