import AuthService from "./services/auth.service.js";

// variables
const formEl = document.getElementById("register-form");

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);

// adds event listener on success message cross
AuthService.addMessageCrossEventListener();

// adds event listener for mobile screen navigation toggle
AuthService.addMobileNavEventListener();

// register form submit event listener
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameEl.value;
  const email = emailEl.value;
  const password = passwordEl.value;

  const isError = AuthService.validateRegisterFormInputs(username, email, password);

  if (isError) {
    return;
  }

  const isRegistered = users.find((user) => user.email === email);
  if (isRegistered) {
    AuthService.toggleResponseMessage("User already exists", "error");
    return;
  }

  const user = { username, email, password, products: [] };
  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  usernameEl.value = "";
  emailEl.value = "";
  passwordEl.value = "";

  AuthService.toggleResponseMessage("Registration successful!", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});
