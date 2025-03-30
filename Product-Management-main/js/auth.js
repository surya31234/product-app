const user = JSON.parse(localStorage.getItem("user-logged-in"));
console.log("auth", user);

if (!user) {
  window.location.href = "error.html";
}
