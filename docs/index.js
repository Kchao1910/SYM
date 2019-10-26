function changeTheme() {
  let body = document.getElementsByTagName("body");
  let theme = body[0].getAttribute("dark-mode");
  let themeIcon = document.querySelector("#dark-mode-icon");
  let header = document.getElementsByTagName("header");
  let docFragment = document.querySelectorAll(".doc-fragment");
  let submitButton = document.querySelector("#submit-button");
  
  theme = (theme === "false") ? "true" : "false";

  switch (theme) {
    case "true":
      changeStyles(body, themeIcon, header, submitButton, "#121212", "#e2e2e2", theme, "brightness_5", "#1f1f1f", docFragment, "#272727", "0px 2px 2px 2px rgba(41, 35, 35, 0.7)");
      break;
    case "false":
      changeStyles(body, themeIcon, header, submitButton, "white", "black", theme, "brightness_4", "#6200ee", docFragment, "white", "0px 2px 2px 2px rgba(211, 211, 211, 0.7)");
      break;
  }
}

function getDocumentFragments() {
  let documentFragmentNodeList = document.querySelectorAll(".doc-fragment");
  return documentFragmentNodeList;
}

function changeStyles(body, themeIcon, header, submitButton, bodyBackgroundColor, bodyColor, colorTheme, textContent, headerBackgroundColor, nodeList, theme, boxShadow) {
  body[0].style.backgroundColor = bodyBackgroundColor;
  body[0].style.color = bodyColor;
  body[0].setAttribute("dark-mode", colorTheme);
  themeIcon.textContent = textContent;
  header[0].style.backgroundColor = headerBackgroundColor;
  submitButton.style.backgroundColor = headerBackgroundColor;
  submitButton.style.color = theme;
  documentFragmentStyles(nodeList, theme, boxShadow);
}

function documentFragmentStyles(nodeList, theme, boxShadow) {
  for (let element of nodeList) {
    element.style = `background-color: ${theme}; box-shadow: ${boxShadow}`; 
  }
}

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

  if (documentFragmentNodeList[0].style.backgroundColor === "rgb(39, 39, 39)" && documentFragmentNodeList.length >= 0)
    documentFragmentStyles(documentFragmentNodeList, "rgb(39, 39, 39)", "0px 2px 2px 2px rgba(41, 35, 35, 0.7)");

  if (documentFragmentNodeList[0].style.backgroundColor === "white" && documentFragmentNodeList.length >= 0)
    documentFragmentStyles(documentFragmentNodeList, "white", "0px 2px 2px 2px rgba(211, 211, 211, 0.7)")
}

(function() {
  let submitButton = document.querySelector("#submit-button");
  submitButton.addEventListener("click", function() {
    validateForm();
  });
})();

function validateForm() {
  let categoryInputElements = document.querySelectorAll(".category-input");
  let expenseInputElements = document.querySelectorAll(".expense-input");

  let categoryInputValues = getInputValues(categoryInputElements);
  let expenseInputValues = getInputValues(expenseInputElements);

  expenseInputValues = stringToNumber(expenseInputValues);

  if (checkString(categoryInputValues).length !== 0) {
    alert("Category names can only be characters.");
    return;
  }

  if (checkNumber(expenseInputValues).length !== 0) {
    alert("Expenses can only be numerical values.");
    return;
  }

  displayResults(categoryInputValues, expenseInputValues);
}

function getInputValues(array) {
  let newArray = [];

  for (let element of array) {
    newArray.push(element.value);
  }

  return newArray;
}

function checkString(array) {
  return array.filter(value => (typeof(value) !== "string"));
}

function checkNumber(array) {
  return array.filter(value => ((typeof(value) !== "number") || (isNaN(value) === true))); // strings converted to number are of type number
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

function displayResults(categoryInputValues, expenseInputValues) {
  createBarChart(categoryInputValues, expenseInputValues);
  displayTotalExpense(expenseInputValues);
}

function createBarChart(categoryInputValues, expenseInputValues) {
  let chart = document.getElementById("mychart");
  resetChart(chart);
  let colors = ["#ff8a80", "#ff80ab", "#ea80ab", "#b388ff", "#8c93ff", "ff5252", "ff4081", "e040fb", "7e4dff", "536dfe", "ff1744", 
  "f50057", "d500f9", "651fff", "3d5afe"];
  let ctx = document.getElementById("mychart").getContext('2d');
  let myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categoryInputValues,
        datasets: [{
            label: "Expense Distribution",
            data: expenseInputValues,
            backgroundColor: colors
        }]
      },
      options: {
        responsive: false,
        title: {
          fontFamily: "'Montserrat', sans-serif",
          display: true,
          text: "Expense Distribution",
          fontColor: "black"
        }
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