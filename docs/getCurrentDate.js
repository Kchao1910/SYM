(function () {
  let currentDateContainer = document.querySelector("#current-date");
  let currentTime = new Date();
  
  currentTime = currentTime.toDateString();

  currentDateContainer.textContent = `Date: ${currentTime}`;
}) ();