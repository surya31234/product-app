import { products } from "./utils/products.js";
import dashboardProductsService from "./services/dashboard-products.service.js";
import dashboardService from "./services/dashboard.service.js";
import DataTable from "./classes/DataTable.class.js";
import User from "./classes/User.class.js";

// variables
const tableEl = document.getElementById("data-table");
const tableBody = document.getElementById("table-body");
const viewModalEl = document.getElementById(`view-modal`);
const editModalEl = document.getElementById(`edit-modal`);
const deleteModalEl = document.getElementById(`delete-modal`);

// table initialization
const table = new DataTable();

table.renderTable(); // for table rendering on page load
table.addSortableEventListeners(tableEl); // for adding event listeners on sortable table headers
table.addCheckboxEventListeners(tableBody); // for adding event listeners on select boxes to select a row
table.addCustomColumnsEventListeners(tableEl, tableBody); // for adding custom columns event listeners
table.addFilterEventListener(); // for adding event listener on filtering data
table.addViewProductModalEventListener(); // for adding event listener on view modal

// modal event listeners
dashboardProductsService.addModalCloseButtonEventListeners(); // for adding event listeners on close button of all modals
dashboardProductsService.addModalCancelButtonEventListener(viewModalEl); // event listener for close button on view modal
dashboardProductsService.addModalCancelButtonEventListener(editModalEl); // event listener for cancel button on edit modal
dashboardProductsService.addModalCancelButtonEventListener(deleteModalEl); // event listener for cancel button on delete modal

// event listener for submit button on edit modal
const editFormEl = editModalEl.querySelector(`#modal-edit-form`);
editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const isError = dashboardProductsService.validateModalFormInputs(editFormEl);
  if (!isError) {
    table.editProduct(editFormEl, editModalEl.dataset.productId);
    table.renderTable();
    editModalEl.close();
  } else {
    addProductModal.scrollTop = 0;
  }
});

// event listener for delete button on delete modal
const deleteDeleteButton = deleteModalEl.querySelector("#delete-delete-button");
deleteDeleteButton.addEventListener("click", () => {
  dashboardProductsService.deleteProduct(parseInt(deleteModalEl.dataset.productId));
  table.renderTable();
  deleteModalEl.close();
});

// event listener for adding dummy product
document.getElementById("add-dummy-product").addEventListener("click", (e) => {
  user.products.push(products[0]);
  table.renderTable();
  User.updateLoggedInUser();
  User.updateUsers();
  dashboardService.toggleSuccessMessage("Product added successfully!");
});

// document.addEventListener("click", (e) => {
//   if (e.target.id !== "columns-dropdown-button") {
//     const columnsDropdownButtonEl = document.getElementById(
//       "columns-dropdown-button"
//     );
//     const columnsDropdownEl = document.querySelector(
//       ".columns-dropdown-content"
//     );
//     columnsDropdownEl.style.display = "none";
//     columnsDropdownButtonEl.classList.remove("columns-dropdown-button-hover");
//   }
// });
