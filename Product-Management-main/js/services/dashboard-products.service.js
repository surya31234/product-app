import User from "../classes/User.class.js";
import dashboardService from "./dashboard.service.js";

class DashboardProductsService {
  constructor() {}

  // function to set modal form errors to empty strings
  #setErrorText(formEl) {
    const errEls = formEl.querySelectorAll('[id^="modal-"][id$="-error"]');
    errEls.forEach((err) => {
      err.textContent = "";
    });
  }

  // function to validate each for input field
  #checkInputError(formEl, fields) {
    let isError = false;

    fields.forEach((field) => {
      const err = formEl.querySelector(`[id^="modal-"][id$="-${field}-error"]`);
      const inputElValue = formEl.querySelector(`[id^="modal-"][id$="-${field}"]`).value;

      if (inputElValue.length < 3) {
        field = `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
        field = `${field.split("-").join(" ")}`;
        err.textContent = `${field} should have at least 3 characters`;
        isError = true;
      }
    });

    return isError;
  }

  // function to validate form inputs
  validateModalFormInputs(formEl) {
    this.#setErrorText(formEl);

    const errsFields = ["name", "title", "desc", "vendor", "product-type", "address"];

    return this.#checkInputError(formEl, errsFields);
  }

  // function to empty add products form
  emptyAddProducts(formEl) {
    formEl.querySelectorAll('[id^="modal-add"]').forEach((element) => {
      element.value = "";
    });
  }

  // function to change styling based on user products
  checkNoProducts(products) {
    const tableContainer = document.querySelector(".table-container");
    const noProductsEl = document.querySelector(".no-products");

    if (products.length === 0) {
      tableContainer.scrollLeft = 0;
      tableContainer.style.overflow = "hidden";
      noProductsEl.style.display = "flex";
    } else {
      noProductsEl.style.display = "none";
      tableContainer.style.overflow = "auto";
    }
  }

  // function to check for length difference when user adds custom columns
  checkLengthDifference(product) {
    const tableThLength = document.querySelectorAll("#data-table thead tr th").length;

    return tableThLength - (Object.keys(product).length + 2);
  }

  // function to get all table headers that have data.
  // it will ignore the checkbox and actions column
  getTableHeaders() {
    let tableHeaders = Array.from(document.querySelectorAll("#data-table thead tr th"));
    tableHeaders = tableHeaders.map((th) => th.dataset.id);
    tableHeaders = tableHeaders.slice(1, -1);

    return tableHeaders;
  }

  // function to get modal form input values and return product
  getProduct(formEl, product_id) {
    const product = {};

    product.id = parseInt(product_id);
    product.name = formEl.querySelector('[id^="modal-"][id$="-name"]').value || "";
    product.title = formEl.querySelector('[id^="modal-"][id$="-title"]').value || "";
    product.vendor = formEl.querySelector('[id^="modal-"][id$="-vendor"]').value || "";
    product.description = formEl.querySelector('[id^="modal-"][id$="-desc"]').value || "";
    product.in_stock = parseInt(formEl.querySelector('[id^="modal-"][id$="-in-stock"]').value) || 0;
    product.sale_price = parseInt(formEl.querySelector('[id^="modal-"][id$="-sale-price"]').value) || 0;
    product.product_type = formEl.querySelector('[id^="modal-"][id$="-product-type"]').value || "";
    product.product_location = formEl.querySelector('[id^="modal-"][id$="-address"]').value || "";
    product.buying_price = parseInt(formEl.querySelector('[id^="modal-"][id$="-buying-price"]').value) || 0;
    product.purchase_quantity = parseInt(formEl.querySelector('[id^="modal-"][id$="-purchase-quantity"]').value) || 0;
    product.shipping_rates = parseInt(formEl.querySelector('[id^="modal-"][id$="-shipping-rates"]').value) || 0;
    product.refill_limit = parseInt(formEl.querySelector('[id^="modal-"][id$="-refill-limit"]').value) || 0;

    return product;
  }

  // function to delete product
  deleteProduct(product_id) {
    const updatedProducts = user.products.filter((prod) => prod.id !== product_id);
    user.products = updatedProducts;

    User.updateLoggedInUser();
    User.updateUsers();
    dashboardService.toggleSuccessMessage("Product deleted successfully!");
  }

  // function to add custom table header
  addCustomHeader(text, tableEl, tableBody) {
    const tableThs = tableEl.querySelectorAll("thead tr th");
    const lastTh = tableThs[tableThs.length - 1];
    const th = this.createTh(text);

    lastTh.parentNode.insertBefore(th, lastTh);

    const tbodyTrs = tableBody.querySelectorAll("tr");
    tbodyTrs.forEach((tr) => {
      const tds = tr.querySelectorAll("td");
      const lastTd = tds[tds.length - 1];
      const td = this.createTd("null");
      td.style.color = "#0000005c";

      lastTd.parentNode.insertBefore(td, lastTd);
    });
  }

  // function for creating actions dropdown
  createActions(bottomEl, product) {
    const td = document.createElement("td");
    td.classList.add("actions");

    const dropdownDiv = document.createElement("div");
    dropdownDiv.classList.add("dropdown");

    const buttonEl = this.#createActionsButton();

    const dropdownContentDiv = document.createElement("div");
    dropdownContentDiv.classList.add("dropdown-content");

    const { viewAnchor, editAnchor, deleteAnchor } = this.#createActionAnchors(product);

    dropdownContentDiv.appendChild(viewAnchor);
    dropdownContentDiv.appendChild(editAnchor);
    dropdownContentDiv.appendChild(deleteAnchor);

    if (bottomEl) {
      dropdownDiv.classList.add("dropdown-bottom");
      buttonEl.classList.add("dropdownButton-bottom");
      dropdownContentDiv.classList.add("dropdown-content-bottom");
    }

    dropdownDiv.appendChild(buttonEl);
    dropdownDiv.appendChild(dropdownContentDiv);

    td.appendChild(dropdownDiv);
    return td;
  }

  // function for creating actions dropdown button
  #createActionsButton() {
    const buttonEl = document.createElement("button");
    buttonEl.classList.add("dropdownButton");
    const buttonI = document.createElement("i");
    buttonI.classList.add("fa", "fa-ellipsis-v", "dropIcon");
    buttonEl.appendChild(buttonI);

    return buttonEl;
  }

  // function for creating action dropdown anchors
  #createActionAnchors(product) {
    const viewAnchor = this.#createActionAnchorEl("View Product", "viewProduct", ["fa", "fa-eye"]);
    const editAnchor = this.#createActionAnchorEl("Edit Product", "editProduct", ["fa", "fa-edit"]);
    const deleteAnchor = this.#createActionAnchorEl("Delete Product", "deleteProduct", ["fa", "fa-trash"]);

    // event listeners for anchors
    const viewModalEl = document.getElementById("view-modal");
    const editModalEl = document.getElementById("edit-modal");
    const deleteModalEl = document.getElementById("delete-modal");

    viewAnchor.addEventListener("click", () => {
      this.#addModalData(viewModalEl, product, "innerHTML");
      viewModalEl.showModal();
    });

    editAnchor.addEventListener("click", () => {
      this.#addModalData(editModalEl, product, "value");
      editModalEl.setAttribute("data-product-id", product.id);
      editModalEl.showModal();
    });

    deleteAnchor.addEventListener("click", () => {
      deleteModalEl.setAttribute("data-product-id", product.id);
      deleteModalEl.showModal();
    });

    return { viewAnchor, editAnchor, deleteAnchor };
  }

  // function for creating anchor elements of dropdown-content
  #createActionAnchorEl(text, className, iconClasses = []) {
    const anchorEl = document.createElement("a");
    anchorEl.classList.add(className);
    anchorEl.setAttribute("data-open-modal", true);

    const spanEl = document.createElement("span");
    spanEl.textContent = text;

    const anchorI = document.createElement("i");
    anchorI.classList.add(...iconClasses);

    anchorEl.appendChild(spanEl);
    anchorEl.appendChild(anchorI);

    return anchorEl;
  }

  // function for creating the checkbox td
  createCheckbox(data_id) {
    const td = document.createElement("td");
    td.classList.add("fixed-column");

    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "checkbox");
    inputEl.classList.add("selectBox");
    inputEl.setAttribute("data-id", `selectbox-${data_id}`);

    td.appendChild(inputEl);

    return td;
  }

  // function to create a table th
  createTh(text) {
    const th = document.createElement("th");
    th.textContent = text;

    return th;
  }

  // function to create a table td
  createTd(text) {
    const td = document.createElement("td");
    td.textContent = text;

    return td;
  }

  // function to add modal data on view/edit modals
  #addModalData(modalEl, product, htmlAttr) {
    modalEl.querySelector('[id^="modal-"][id$="-name"]')[htmlAttr] = product.name;
    modalEl.querySelector('[id^="modal-"][id$="-title"]')[htmlAttr] = product.title;
    modalEl.querySelector('[id^="modal-"][id$="-desc"]')[htmlAttr] = product.description;
    modalEl.querySelector('[id^="modal-"][id$="-vendor"]')[htmlAttr] = product.vendor;
    modalEl.querySelector('[id^="modal-"][id$="-in-stock"]')[htmlAttr] = product.in_stock;
    modalEl.querySelector('[id^="modal-"][id$="-sale-price"]')[htmlAttr] = product.sale_price;
    modalEl.querySelector('[id^="modal-"][id$="-product-type"]')[htmlAttr] = product.product_type;
    modalEl.querySelector('[id^="modal-"][id$="-address"]')[htmlAttr] = product.product_location;
    modalEl.querySelector('[id^="modal-"][id$="-buying-price"]')[htmlAttr] = product.buying_price;
    modalEl.querySelector('[id^="modal-"][id$="-purchase-quantity"]')[htmlAttr] = product.purchase_quantity;
    modalEl.querySelector('[id^="modal-"][id$="-shipping-rates"]')[htmlAttr] = product.shipping_rates;
    modalEl.querySelector('[id^="modal-"][id$="-refill-limit"]')[htmlAttr] = product.refill_limit;
  }

  // event listeners for cross button on all modals
  addModalCloseButtonEventListeners() {
    const modalClose = document.querySelectorAll(".modal-close");
    modalClose.forEach((closeEl) => {
      closeEl.addEventListener("click", () => {
        const modalEl = document.getElementById(`${closeEl.dataset.id}`);
        modalEl.close();
      });
    });
  }

  // event listener for close button on modal
  addModalCancelButtonEventListener(modalEl) {
    const cancelButton = modalEl.querySelector('[id$="-close-button"]');
    cancelButton.addEventListener("click", () => {
      modalEl.close();
    });
  }
}

export default new DashboardProductsService();
