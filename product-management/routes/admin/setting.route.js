const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/setting.controller");
const uplodaCloud = require("../../middlewares/admin/uploadCould.middleware");

router.get("/general", controller.general);

router.patch("/general", upload.single("logo"), uplodaCloud.upload,controller.generalPatch);

module.exports = router;
