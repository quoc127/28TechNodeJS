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

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector("[data-user-accept]");
  const userId = dataUsersAccept.getAttribute("data-user-accept");
  if (userId == data.userId) {
    // Show the user outside the interface
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="/images/avatar.png" alt="${data.infoUserA.fullName}" />
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.infoUserA.fullName}</div>
          <div class="inner-buttons">
            <button 
              class="btn btn-sm btn-primary" style="margin-right: 10px"
              btn-accept-friend="${data.infoUserA._id}"
            >
              Chấp nhận
            </button>
            <button 
              class="btn btn-sm btn-secondary" style="margin-right: 10px"
              btn-refuse-friend="${data.infoUserA._id}"
            >
              Xóa
            </button>
            <button 
              class="btn btn-sm btn-secondary" 
              btn-deleted-friend="66796ce1c8f335ce769fab03" 
              disabled=""
            >
              Đã xóa
            </button>
            <button 
              class="btn btn-sm btn-primary" 
              btn-accepted-friend="66796ce1c8f335ce769fab03" 
              disabled=""
            >
              Đã chấp nhận
            </button>
          </div>
        </div>
      </div>
    `;
    dataUsersAccept.appendChild(newBoxUser);
    // End show the user outside the interface

    // Remove request add friend
    const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]")
    btnRefuseFriend.addEventListener("click", () => {
      btnRefuseFriend.closest(".box-user").classList.add("refuse");
      const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

      socket.emit("CLINET_REFUSE_FRIEND", userId);
    });
    // End remove request add friend

    // Accept request add friend
    const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]")
    btnAcceptFriend.addEventListener("click", () => {
      btnAcceptFriend.closest(".box-user").classList.add("accepted");
      const userId = btnAcceptFriend.getAttribute("btn-accept-friend");

      socket.emit("CLINET_ACCEPT_FRIEND", userId);
    });
    // End accept request add friend
  }
});
// END SERVER_RETURN_INFO_ACCEPT_FRIEND
