const mongoose = require("mongoose");

const fortPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt:{
      type: Date,
      expires: 180
    }
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", fortPasswordSchema, "forgot-password");

module.exports = ForgotPassword;
