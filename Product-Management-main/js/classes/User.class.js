// NOTE: 'user' variable is declared in auth.js.
// auth.js is being called in 'head' of dashboard.html.
// this is why we can access it everywhere else without
// declaring it again and again.

class User {
  constructor() {}

  // function to get user products
  static getUserProducts() {
    return user.products;
  }

  // function to get new product id
  static getNewProductId() {
    return user.products[user.products.length - 1]?.id + 1 || 1;
  }

  // function to update logged in user in local storage
  static updateLoggedInUser() {
    localStorage.setItem("user-logged-in", JSON.stringify(user));
  }

  // function to update users in local storage
  static updateUsers() {
    const users = JSON.parse(localStorage.getItem("users"));
    const updatedUsers = users.map((usr) => {
      if (usr.email === user.email) {
        usr = { ...user };
      }
      return usr;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }

  // function to update products of user
  static updateUserProducts(product) {
    const updatedProducts = user.products.map((prod) => {
      if (prod.id === product.id) {
        return product;
      }
      return prod;
    });

    user.products = updatedProducts;
  }
}

export default User;
