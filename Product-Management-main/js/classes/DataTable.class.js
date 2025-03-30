import dashboardProductsService from "../services/dashboard-products.service.js";
import dashboardService from "../services/dashboard.service.js";
import User from "./User.class.js";

class DataTable {
  // constructor
  constructor() {
    this.checkboxProducts = [];
    this.sortDirection = 1; // Sort direction: 1 for ascending, -1 for descending
    this.sortColumn = ""; // Column to sort
    this.prevSortable;
    this.newProduct_id = User.getNewProductId();
  }

  // function to update new product id
  #updateNewProductId() {
    this.newProduct_id++;
  }

  // function to get new product id
  #getNewProductId() {
    return this.newProduct_id;
  }

  // function for rendering table.
  // this function is called each time any changes are
  // made in the table row. i.e. adding, editing, deleting a
  // product, adding custom columns, sorting, and filtering.
  renderTable(products = user.products) {
    const tbodyEl = document.getElementById("table-body");
    tbodyEl.innerHTML = "";

    // check if user has no products
    dashboardProductsService.checkNoProducts(user.products);

    // this for loop will only run if user has products
    for (let [index, product] of products.entries()) {
      let tr = document.createElement("tr");
      const checkboxEl = dashboardProductsService.createCheckbox(product.id);

      tr.appendChild(checkboxEl);

      // the product data in user products is saved as a json object.
      // this is to make sure that the data is added in the correct column
      dashboardProductsService.getTableHeaders().forEach((tableTh) => {
        const td = document.createElement("td");
        td.textContent = product[tableTh];

        if (tableTh === "title") {
          td.classList.add("title");
        }
        if (tableTh === "description") {
          td.classList.add("description");
        }

        tr.appendChild(td);
      });

      // this check is for adding 'null' in row data if a column is added dynamically
      const lengthDiff = dashboardProductsService.checkLengthDifference(product);
      if (lengthDiff) {
        for (let i = 0; i < lengthDiff; i++) {
          const customTd = dashboardProductsService.createTd("null");
          customTd.style.color = "#0000005c";
          tr.appendChild(customTd);
        }
      }

      // this check is for changing position css of table row actions.
      // if there are more than 6 products then starting from the 6th
      // product the position of action dropdown will move up
      let actionsTd;
      if (index > user.products.length - 4 && user.products.length > 6) {
        actionsTd = dashboardProductsService.createActions(true, product);
      } else {
        actionsTd = dashboardProductsService.createActions(false, product);
      }
      tr.appendChild(actionsTd);

      tbodyEl.appendChild(tr);
    }
  }

  // function to render selected products.
  // this will run when a product checkbox is selected
  renderSelectProducts() {
    const selectedProductsDiv = document.getElementById("selected-products");
    selectedProductsDiv.innerHTML = "";
    this.checkboxProducts.forEach((product) => {
      selectedProductsDiv.innerHTML += `<p class="selected-product">${product.id} , ${product.name} , ${product.title}</p>`;
    });
  }

  // function to add a product.
  // this function will run when submit is clicked
  // on Add Product modal
  addProduct(formEl) {
    const newProduct = dashboardProductsService.getProduct(formEl, this.#getNewProductId());
    user.products.push(newProduct);

    User.updateLoggedInUser();
    User.updateUsers();
    this.#updateNewProductId();
    dashboardProductsService.emptyAddProducts(formEl);
    dashboardService.toggleSuccessMessage("Product added successfully!");
  }

  // function to edit product.
  // this function will run when submit is clicked
  // on Edit Product modal
  editProduct(formEl, prod_id) {
    const editedProduct = dashboardProductsService.getProduct(formEl, prod_id);

    User.updateUserProducts(editedProduct);
    User.updateLoggedInUser();
    User.updateUsers();
    dashboardService.toggleSuccessMessage("Product updated successfully!");
  }

  // function for sorting.
  // this function will run when a table header is clicked
  handleSort(column) {
    if (column === this.sortColumn) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = -1;
    }

    user.products.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return -this.sortDirection;
      }
      if (valueA > valueB) {
        return this.sortDirection;
      }

      return 0;
    });
  }

  // function to add sortable th event listeners
  addSortableEventListeners(tableEl) {
    tableEl.querySelectorAll("th.sortable").forEach((th) => {
      th.addEventListener("click", (e) => {
        const sortableEl_id = th.dataset.id;
        this.handleSort(sortableEl_id);
        this.renderTable();

        const upArrow = th.querySelector(".arrow-up");
        const downArrow = th.querySelector(".arrow-down");

        // changing styling of arrows
        if (this.prevSortable) {
          this.prevSortable.style.opacity = 0.5;
        }

        if (this.sortDirection === 1) {
          upArrow.style.opacity = 1;
          downArrow.style.opacity = 0.5;
          this.prevSortable = upArrow;
        } else {
          upArrow.style.opacity = 0.5;
          downArrow.style.opacity = 1;
          this.prevSortable = downArrow;
        }
      });
    });
  }

  // function to add event listeners on row checkboxes - work in progress
  // this will only work on initial page load. This is because these event listeners
  // are unmounted when renderTable() is called on data table html manipulation
  addCheckboxEventListeners(tableBody) {
    tableBody.querySelectorAll(".selectBox").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const product_id = checkbox.dataset.id.split("-")[1]; // checkbox id example : data-id = "selectbox-0"
        if (checkbox.checked) {
          this.checkboxProducts.push(user.products.find((product) => product.id === parseInt(product_id)));
          this.renderSelectProducts();
        } else {
          this.checkboxProducts = this.checkboxProducts.filter((product) => product.id !== parseInt(product_id));
          this.renderSelectProducts();
        }
      });
    });
  }

  // function to add event listener on filter search
  addFilterEventListener() {
    const searchEl = document.getElementById("search-text");
    const filterOptionsEl = document.getElementById("filter-options");
    searchEl.addEventListener("keyup", () => {
      const filterBy = filterOptionsEl.value;
      const searchValue = searchEl.value;

      if (searchValue !== "") {
        const filterProducts = user.products.filter((product) => {
          if (typeof product[filterBy] === "string") {
            return product[filterBy].toLowerCase().includes(searchValue.toLowerCase());
          } else {
            return product[filterBy].toString().includes(searchValue);
          }
        });

        this.renderTable(filterProducts);
      } else {
        this.renderTable();
      }
    });

    filterOptionsEl.addEventListener("change", () => {
      searchEl.value = "";
    });
  }

  // function to add custom columns event listener
  addCustomColumnsEventListeners(tableEl, tableBody) {
    const customColumnsButtonEl = document.querySelector(".columns-dropdown-button");
    const customColumnsDropdownEl = document.querySelector(".columns-dropdown-content");

    DataTable.#addCustomColumnsButtonEventListener(customColumnsButtonEl, customColumnsDropdownEl);
    DataTable.#addCustomColumnsPEventListeners(customColumnsDropdownEl, customColumnsButtonEl, tableEl, tableBody);
    DataTable.#addCustomColumnsUserEventListener(customColumnsDropdownEl, customColumnsButtonEl, tableEl, tableBody);
  }

  // function to add event listener on custom columns button.
  // it will change the styling of custom columns dropdown
  static #addCustomColumnsButtonEventListener(buttonEl, dropdownEl) {
    buttonEl.addEventListener("click", () => {
      if (dropdownEl.style.display === "none") {
        dropdownEl.style.display = "block";
        buttonEl.classList.add("columns-dropdown-button-hover");
      } else {
        dropdownEl.style.display = "none";
        buttonEl.classList.remove("columns-dropdown-button-hover");
      }
    });
  }

  // function to add event listeners on pre defined custom columns in the dropdown.
  static #addCustomColumnsPEventListeners(dropdownEl, buttonEl, tableEl, tableBody) {
    dropdownEl.querySelectorAll("p").forEach((p) => {
      p.addEventListener("click", () => {
        dashboardProductsService.addCustomHeader(p.textContent, tableEl, tableBody);
        dashboardService.toggleSuccessMessage(`'${p.textContent}' column added!`);

        dropdownEl.style.display = "none";
        buttonEl.classList.remove("columns-dropdown-button-hover");
      });
    });
  }

  // function to add event listener on submit button of custom columns dropdown form.
  // it will handle all of the functionality after user submits a user entered column
  static #addCustomColumnsUserEventListener(dropdownEl, buttonEl, tableEl, tableBody) {
    dropdownEl.querySelector(".columns-dropdown-submit").addEventListener("click", () => {
      const pattern = /^[A-Za-z\s]+$/;
      const customColumnText = dropdownEl.querySelector("input").value;

      const customColumnError = dropdownEl.querySelector(".custom-column-error");

      if (customColumnText.length === 0) {
        customColumnError.innerHTML = "please enter a name";
      } else if (!pattern.test(customColumnText)) {
        customColumnError.innerHTML = "name should only have alphabets";
      } else {
        dashboardProductsService.addCustomHeader(customColumnText, tableEl, tableBody);
        dashboardService.toggleSuccessMessage(`'${customColumnText}' column added!`);

        customColumnError.innerHTML = "";
        dropdownEl.style.display = "none";
        buttonEl.classList.remove("columns-dropdown-button-hover");
      }
    });
  }

  // function for adding event listener on add modal
  addViewProductModalEventListener() {
    const addProductModal = document.getElementById("add-modal");
    const formEl = document.getElementById("modal-add-form");

    const addCloseButton = addProductModal.querySelector("#add-close-button");
    addCloseButton.addEventListener("click", () => {
      addProductModal.close();
    });

    document.querySelector("#add-product-toolbar").addEventListener("click", () => {
      addProductModal.showModal();
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const isError = dashboardProductsService.validateModalFormInputs(formEl);
      if (!isError) {
        this.addProduct(formEl);
        addProductModal.close();
        this.renderTable();
      } else {
        addProductModal.scrollTop = 0;
      }
    });
  }
}

export default DataTable;
