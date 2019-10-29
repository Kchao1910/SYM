let csvDownloadButton = document.querySelector("#save-alt");

// mainTheme is an object to hold the default setting for changing themes
let mainTheme = {
  darkModeOn: false //default settings
}

// Theme is an object that holds the properties of a certain theme (dark mode and light mode)
function Theme(bodyBackgroundColor, bodyColor, boxShadow, brightness, buttonClassName, formBackgroundColor, headerBackgroundColor, mode) {
  this.bodyBackgroundColor = bodyBackgroundColor;
  this.bodyColor = bodyColor;
  this.boxShadow = boxShadow;
  this.brightness = brightness;
  this.buttonClassName = buttonClassName;
  this.formBackgroundColor = formBackgroundColor;
  this.headerBackgroundColor = headerBackgroundColor;
  this.mode = mode;
}

let darkTheme = new Theme("rgba(0, 0, 0, 0.9)", "rgba(255, 255, 255, 0.9)", "0px 4px 10px rgba(0, 0, 0, 0.25)", "brightness_5", "dark-button", "rgb(39, 39, 39)", "rgb(39, 39, 39)", "true");

let lightTheme = new Theme("white", "black", "0px 4px 10px rgba(0, 0, 0, 0.25)", "brightness_4", "light-button", "white", "rgb(98, 0, 238)", "false");

// changeTheme handles changing themes between dark mode and light mode
function changeTheme() {
  let body = document.getElementsByTagName("body");
  let theme = mainTheme.darkModeOn;
  let themeIcon = document.querySelector("#dark-mode-icon");
  let header = document.getElementsByTagName("header");
  let docFragment = document.querySelectorAll(".doc-fragment");
  let submitButton = document.querySelector("#submit-button");

  if (theme === false) {
    // change to dark theme
    changeStyles(body, themeIcon, header, submitButton, docFragment, darkTheme);
    mainTheme.darkModeOn = true;
  } else {
    // change to light theme
    changeStyles(body, themeIcon, header, submitButton, docFragment, lightTheme);
    mainTheme.darkModeOn = false;
  }
}

// getDocumentFragments retrieves all form elements
function getDocumentFragments() {
  let documentFragmentNodeList = document.querySelectorAll(".doc-fragment");
  return documentFragmentNodeList;
}

// changeStyles takes in elements and styles them depending on the selected theme
function changeStyles(body, themeIcon, header, submitButton, nodeList, newTheme) {
  body[0].style.backgroundColor = newTheme.bodyBackgroundColor;
  body[0].style.color = newTheme.bodyColor;
  body[0].style.boxShadow = newTheme.boxShadow;
  csvDownloadButton.setAttribute("class", `${newTheme.buttonClassName} material-icons`);
  themeIcon.textContent = newTheme.brightness;
  header[0].style.backgroundColor = newTheme.headerBackgroundColor;
  submitButton.setAttribute("class", newTheme.buttonClassName);
  documentFragmentStyles(nodeList, newTheme.formBackgroundColor, newTheme.boxShadow);
}

// documentFragmentStyles changes the styles of form elements
function documentFragmentStyles(nodeList, theme, boxShadow) {
  for (let element of nodeList) {
    element.style = `background-color: ${theme}; box-shadow: ${boxShadow}`; 
  }
}

// elementCreation appends a form(category name and expenses) element to the DOM
function elementCreation() {
  const mainBudgetContainer = document.querySelector(".main-budget-container");
  const docFragment = document.createDocumentFragment();
  const section = document.createElement("section");

  section.setAttribute("class", "doc-fragment");

  const budgetForm = document.createElement("section");
  const categoryContainer = document.createElement("section");
  const expenseContainer = document.createElement("section");
  const deleteIcon = document.createElement("i");

  budgetForm.setAttribute("class", "budget-form");
  categoryContainer.setAttribute("class", "budget-section");
  expenseContainer.setAttribute("class", "budget-section");
  deleteIcon.setAttribute("class", "material-icons delete-icon");

  const categoryLabel = document.createElement("label");
  const categoryInput = document.createElement("input");
  const expenseLabel = document.createElement("label");
  const expenseInput = document.createElement("input");

  categoryInput.setAttribute("class", "category-input");
  expenseInput.setAttribute("class", "expense-input");

  categoryInput.placeholder = "Rent";
  expenseInput.placeholder = "1000.00";

  categoryLabel.textContent = "Category Name";
  expenseLabel.textContent = "Expenses";
  deleteIcon.textContent = "delete";

  deleteIcon.addEventListener("click", function(deleteIcon) {
    let parent = deleteIcon.target.parentElement;
    mainBudgetContainer.removeChild(parent);
  });

  categoryContainer.appendChild(categoryLabel);
  categoryContainer.appendChild(categoryInput);
  expenseContainer.appendChild(expenseLabel);
  expenseContainer.appendChild(expenseInput);

  budgetForm.appendChild(categoryContainer);
  budgetForm.appendChild(expenseContainer);
  section.appendChild(budgetForm);
  section.appendChild(deleteIcon);

  docFragment.appendChild(section);

  mainBudgetContainer.appendChild(docFragment);

  let documentFragmentNodeList = getDocumentFragments();

  if (mainTheme.darkModeOn === true) {
    documentFragmentStyles(documentFragmentNodeList, "rgb(39, 39, 39)", "0px 4px 10px rgba(0, 0, 0, 0.25)");
  } else {
    documentFragmentStyles(documentFragmentNodeList, "white", "0px 4px 10px rgba(0, 0, 0, 0.25)");
  }
}

// this is an IIFE that ensures that the user enters in the correct input
(function() {
  let submitButton = document.querySelector("#submit-button");
  submitButton.addEventListener("click", function() {
    disableCsvDownload();
    validateForm();
  });
})();

// checks if the user enters in the right information type
function validateForm() {
  if (getDocumentFragments().length === 0)
    return;

  let categoryInputElements = [...document.querySelectorAll(".category-input")];
  let expenseInputElements = [...document.querySelectorAll(".expense-input")];

  let categoryInputValues = getInputValues(categoryInputElements);
  let expenseInputValues = getInputValues(expenseInputElements);

  expenseInputValues = stringToNumber(expenseInputValues);

  if (checkString(categoryInputValues).length !== 0) {
    alert("Categories must be filled out with characters.");
    return;
  }

  if (checkNumber(expenseInputValues).length !== 0) {
    alert("Expenses must be completed with numerical values.");
    return;
  }

  enableCsvDownload(categoryInputValues, expenseInputValues);

  displayResults(categoryInputValues, expenseInputValues);
}

// getInputValues retrieves input values
function getInputValues(array) {
  return array.map(element => element.value);
}

function checkString(array) {
  return array.filter(value => (typeof(value) !== "string") || (value === ""));
}

function checkNumber(array) {
  return array.filter(value => ((value === 0) || (typeof(value) !== "number") || (isNaN(value) === true))); // strings converted to number are of type number
}

function stringToNumber(array) {
  return array.map(value => Number(value));
}

function getSum(array) {
  let sum = 0;
  
  for (let number of array) {
    sum += number;
  }

  return sum;
}

// displayResults outputs the total expenses
function displayResults(categoryInputValues, expenseInputValues) {
  createDonutChart(categoryInputValues, expenseInputValues);
  displayTotalExpense(expenseInputValues);
}

// createDonutChart displays a doughnut chart
function createDonutChart(categoryInputValues, expenseInputValues) {
  let chart = document.getElementById("mychart");
  resetChart(chart);
  let colors = ["#ff8a80", "#ff80ab", "#ea80ab", "#b388ff", "#8c93ff", "#82b1ff", "#80d8ff", "#84ffff", "#a7ffeb", "#b9f6ca", "#ccff90", 
  "#f4ff81", "#ffff8d", "#ffe57f", "#ffd180", "#ff9e80"];
  let ctx = document.getElementById("mychart").getContext('2d');
  let myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categoryInputValues,
        datasets: [{
            data: expenseInputValues,
            backgroundColor: colors
        }]
      },
      options: {
        responsive: false,
      }
  });
}

function displayTotalExpense(expenseInputValues) {
  let sum = getSum(expenseInputValues).toFixed(2);
  let expenseTotalElement = document.querySelector("#total-expense");

  expenseTotalElement.textContent = `Total Expenses: $${sum}`;
}

function resetChart(chart) {
  let expenseChart = document.querySelector("#expense-chart");

  expenseChart.removeChild(chart);

  createNewCanvas(expenseChart);
}

function createNewCanvas(parent) {
  let documentFragment = document.createDocumentFragment();

  let canvas = document.createElement("canvas");
  
  canvas.setAttribute("id", "mychart");
  canvas.setAttribute("width", "280px");
  canvas.setAttribute("height", "280px");

  documentFragment.appendChild(canvas);
  parent.prepend(documentFragment);
}

// this IIFE displays a default chart with no data when the user first uses the application
setTimeout(function() {
  let ctx = document.getElementById("mychart").getContext('2d');
  let myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["No data"],
        datasets: [{
            data: ["100"]
        }]
      },
      options: {
        responsive: false,
      }
  });
}, 1000);

function enableCsvDownload(categoryInputValues, expenseInputValues) {
  csvDownloadButton.removeAttribute("disabled");
  csvDownloadButton.setAttribute("enabled", "enabled");
  document.querySelector("#save-alt").addEventListener("click", function() {
    createCsv(categoryInputValues, expenseInputValues);
  });
}

function disableCsvDownload()
{
  csvDownloadButton.removeAttribute("enabled");
  csvDownloadButton.setAttribute("disabled", "disabled");
}

function createCsv(categoryInputValues, expenseInputValues) {
  let rows = [];
  for (let element in categoryInputValues) {
    rows[element] = [categoryInputValues[element], expenseInputValues[element]];
  }

  let csv = 'Category, Expense\n';
  
  rows.forEach(function(rowList) {
    csv += rowList.join(',');
    csv += "\n";
  });

  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  link.target = '_blank';
  link.download = "symBudget.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}