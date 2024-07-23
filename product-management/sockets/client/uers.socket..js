const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // "A" is get request add friend and "B" is who send request add friend
    // User send request add friend
    socket.on("CLINET_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Add id "A" in acceptFriends "B"
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

      // Add id "B" in requestFriends "A"
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

      // Get length acceptFriends "B" and return "B"
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // Get info "A" return "B"
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id avtar fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });

    // User cancel request add friend
    socket.on("CLINET_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Delete id "A" in acceptFriends "B"
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

      // Delete id "B" in requestFriends "A"
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

      // Get length acceptFriends "B" and return "B"
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
    });

    // User refuse request add friend
    socket.on("CLINET_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Delete id "A" in acceptFriends "B"
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

      // Delete id "B" in requestFriends "A"
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

    // User accept request add friend
    socket.on("CLINET_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Delete id "A" in acceptFriends "B" and add user_id, room_chat_id "A" in friendList "B"
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
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Delete id "B" in requestFriends "A" and add user_id, room_chat_id "B" in friendList "A"
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
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
