var weatherLocationEl = document.getElementById("city-input");
var searchBtnEl = document.getElementById("search");
var cityNameEl = document.getElementById("city-name");
var searchCardEl = document.getElementById("search-box");

var apiKey = "GlInm5aSMTSP0UAHNS9Eu4hbsdpHGcaK";
var apiKey2 = "";

function getWeather(city) {
  var apiUrl =
    "https://api.tomorrow.io/v4/weather/forecast?location=" +
    city +
    "&timesteps=1d&units=imperial&apikey=" +
    apiKey;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          var dataValues = data.timelines.daily;
          var index = 1

          console.log(dataValues);

          var today = dayjs().format("MM/DD/YYYY");

          var dateText = today;
          $("#present" + " li:first-child").text("Date: " + dateText);

          var tempToday = dataValues[0].values.temperatureAvg;
          $("#present" + " li:nth-child(2)").text("Temp: " + tempToday + " F°");

          var windToday = dataValues[0].values.windSpeedAvg;
          $("#present" + " li:nth-child(3)").text("Wind: " + windToday + " mph");

          var humidityToday = dataValues[0].values.humidityAvg;
          $("#present" + " li:nth-child(4)").text("Humidity: " + humidityToday);

          for (var i = 1; i < dataValues.length; i++) {
            var day = dataValues[i];

            time = day.time.split('T')

            // set and declare weather data variables
            var dateText = dayjs(time[0]).format("MM/DD/YYYY");
            var tomorrow = dayjs(today).add(1, "day").format("MM/DD/YYYY");
            var todayPlusFive = dayjs(today).add(6, "day").format("MM/DD/YYYY");

            if (
              dateText >= tomorrow &&
              dateText < todayPlusFive
            ) {
              // create dom elements and assign weather data
              var elementId = "#day" + index;

              var dateText = dayjs(time[0]).format("MM/DD/YYYY");
              $(elementId + " li:first-child").text("Date: " + dateText);

              var tempText = day.values.temperatureAvg
              $(elementId + " li:nth-child(2)").text("Temp: " + tempText + " F°");

              var windText = day.values.windSpeedAvg;
              $(elementId + " li:nth-child(3)").text("Wind: " + windText + " mph");

              var humText = day.values.humidityAvg;
              $(elementId + " li:nth-child(4)").text("Humidity: " + humText);

              index++;
            }
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect Tomorrow.io API");
    });
}

window.addEventListener("load", function (event) {
  // pull search history from local storage
  var searchHistory = JSON.parse(localStorage.getItem("history")) || [];

  //  button creation variable
  buttonCreate = "button";
  var si = 0;

  // for loop for iterating through the array variables in session storage and creating the buttons in the search area
  for (let si = 0; si < searchHistory.length; si++) {
    var buttonEl = document.createElement(buttonCreate);
    (buttonEl.textContent = searchHistory[si]),
      buttonEl.setAttribute("class", "btn btn-secondary w-100 m-2 p-3 s-3");
    buttonEl.setAttribute("type", "button");
    searchCardEl.appendChild(buttonEl);
  }
});

searchBtnEl.addEventListener("click", function () {
  // pull in values from the search input boxes
  var city = $("#city-input").val();

  console.log(city);

  var searchHistory = [];

  // capitalize city and state inputs - for display and local storate
  city = city.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
    return letter.toUpperCase();
  });

  // declare search history array heck if values already exist in local storage
  var history = JSON.parse(localStorage.getItem("history")) || [];

  // append City and State to history array and store in local storage
  history.push(city);

  localStorage.setItem("history", JSON.stringify(history));

  searchHistory = JSON.parse(localStorage.getItem("history")) || [];

  buttonCreate = "button";

  var si = 0;

  // for loop for iterating through the array variables in session storage and creating the buttons in the search area
  for (let si = 0; si < searchHistory.length; si++) {
    var buttonEl = document.createElement(buttonCreate);

    (buttonEl.textContent = searchHistory[si]),
      buttonEl.setAttribute("class", "btn btn-secondary w-100 m-2 p-3 s-3");
    buttonEl.setAttribute("type", "button");
    searchCardEl.appendChild(buttonEl);
  }

  getWeather(city);
});

$(document).on("click", ".btn-secondary", function (event) {
  event.preventDefault();

  var city = $(this).text();

  getWeather(city);
});
