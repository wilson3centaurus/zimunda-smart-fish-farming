let modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
let logoutModal = document.querySelector(".user-dropdown-modal");
let notificationModal = document.querySelector(".modal");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == logoutModal) {
    logoutModal.style.display = "none";
  }
  if (event.target == notificationModal) {
    notificationModal.style.display = "none";
  }
};
