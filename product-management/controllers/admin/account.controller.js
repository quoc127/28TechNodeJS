const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find);

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo mới tài khoản",
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);

  const record = new Account(req.body)
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/accounts`)
};