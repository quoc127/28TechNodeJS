const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
      pageTitle: "Nhóm quyền",
      records: records,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug"),
    {
      pageTitle: "Tạo nhóm quyền",
    };
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();

    req.flash("success", "Tạo nhóm quyền thành công!");
  } catch (error) {
    req.flash("success", "Tạo nhóm quyền thất bại!");
    console.log(error);
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PACTH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật nhóm quyền thành công!");
  } catch (error) {
    console.log(error);
    req.flash("success", "Cập nhật nhóm quyền thất bại!");
  }
  res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }

    req.flash("success", "Cập nhật phân quyền thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật phân quyền thất bại!");
  }
};
