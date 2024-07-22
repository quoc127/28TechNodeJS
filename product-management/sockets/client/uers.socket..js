const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // User send request add friend
    // "A" is get request add friend and "B" is who send request add friend
    socket.on("CLINET_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      
      // Add id "A" on acceptFriends "B"
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

      // Add id "B" on requestFriends "A"
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

    // User cancel request add friend
    socket.on("CLINET_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      
      // Delete id "A" on acceptFriends "B"
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (existUserAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          }
        );
      }

      // Delete id "B" on requestFriends "A"
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });

      if (existUserBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });

    // User refuse request add friend
    socket.on("CLINET_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      
      // Delete id "A" on acceptFriends "B"
      const existUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      if (existUserAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Delete id "B" on requestFriends "A"
      const existUserBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });

      if (existUserBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
