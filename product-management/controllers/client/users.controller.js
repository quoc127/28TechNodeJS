const User = require("../../models/user.model");
const userSocket = require("../../sockets/client/uers.socket.");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  try {
    // Socket
    userSocket(res);
    // End Socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
      _id: userId,
    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { _id: { $nin: requestFriends } },
        { _id: { $nin: acceptFriends } },
      ],
      status: "active",
      deleted: false,
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend.pug", {
      pageTitle: "Danh sách người dùng",
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  try {
    // Socket
    userSocket(res);
    // End Socket

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
      _id: userId,
    });
    const requestFriends = myUser.requestFriends;
    const users = await User.find({
      _id: { $in: requestFriends },
      status: "active",
      deleted: false,
    }).select("id avatar fullName");
    res.render("client/pages/users/request.pug", {
      pageTitle: "Lời mời đã gửi",
      users: users
    });
  } catch (error) {
    console.log(error);
  }
};
