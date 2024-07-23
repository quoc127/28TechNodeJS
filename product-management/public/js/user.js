// Send request add friend
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLINET_ADD_FRIEND", userId);
    });
  });
}
// End send request add friend

// Cancel request add friend
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLINET_CANCEL_FRIEND", userId);
    });
  });
}
// End cancel request add friend

// Refuse request add friend
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLINET_REFUSE_FRIEND", userId);
    });
  });
}
// End refuse request add friend

// Accepet request add friend
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLINET_ACCEPT_FRIEND", userId);
    });
  });
}
// End Accepet request add friend

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  if (userId == data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND
