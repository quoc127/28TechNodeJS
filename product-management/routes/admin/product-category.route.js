const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");
const uplodaCloud = require("../../middlewares/admin/uploadCould.middleware");

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uplodaCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uplodaCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
