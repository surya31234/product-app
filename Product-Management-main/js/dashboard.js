import dashboardService from "./services/dashboard.service.js";

// event listener for success message div cross
const successCrossEl = document.getElementById("success-message-cross");
successCrossEl.addEventListener("click", () => {
  document.getElementById("success-message").style.display = "none";
});

// event listener for logout button
const logoutEl = document.getElementById("logout");
logoutEl.addEventListener("click", () => {
  dashboardService.toggleSuccessMessage("Logout Successful", 1500);
  localStorage.removeItem("user-logged-in");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
