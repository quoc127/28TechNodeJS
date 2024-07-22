const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLINET_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // A is get request add friend and B is who send request add friend
      // Add id A on acceptFriends B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (!existUserAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }

      // Add id B on acceptFriends A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });

      if (!existUserBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
    });
  });
};
