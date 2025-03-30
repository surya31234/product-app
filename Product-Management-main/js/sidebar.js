const sidebarBtn = document.querySelector("#sidebar-menu-btn");
const sidebar = document.querySelector(".sidebar");

const usernameEl = document.getElementById("sidebar-username");
usernameEl.innerHTML = user.username;

const emailEl = document.getElementById("sidebar-user-email");
emailEl.innerHTML = user.email;

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

function toggleActiveClass() {
  if (window.innerWidth >= 1024) {
    sidebar.classList.add("active");
  } else {
    sidebar.classList.remove("active");
  }
}

window.onload = toggleActiveClass;
window.onresize = toggleActiveClass;
