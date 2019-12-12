const baseOption = document.getElementById("baseOption");

const selectA = document.getElementById("selectA");
const selectB = document.getElementById("selectB");
// const switchButton = document.getElementById("switchButton");
const inputA = document.getElementById("iA");
const inputB = document.getElementById("iB");

const oneY = document.getElementById("oY");
const oneW = document.getElementById("oW");
const oneD = document.getElementById("oD");

const specificDateInput = document.getElementById("dateInput");

const specificDate = "https://api.exchangeratesapi.io/";
const latestDate = "https://api.exchangeratesapi.io/latest";
const prevValues = document.getElementById("rates");
let baseA = "CAD";
const precision = 5;
let currentAIndex = 1;
let currentBIndex = 0;

let currencyNames = {};

let selectedDate = new Date();

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const date = new Date();
let endDate = new Date(date.addDays(-1));
let startDate = new Date(date.setFullYear(date.getFullYear() - 1));

function calc() {
  inputB.value = (
    Number.parseFloat(inputA.value) *
    Number.parseFloat(selectB.options[selectB.selectedIndex].value)
  )
    .toFixed(precision)
    .toString();
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

let getExchangeRates = function(date, base = "HKD") {
  console.log(base);

  return new Promise(function(resolve, reject) {
    prevValues.innerHTML = "";
    baseA = base;
    // if (date) {
    //   document.getElementById("date").innerHTML = date.toLocaleDateString(
    //     navigator.language
    //   );
    // }
    // } else {
    //   document.getElementById("date").innerHTML = new Date().toLocaleDateString(
    //     navigator.language
    //   );
    // }

    let url = date
      ? specificDate +
        (date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()) +
        `?base=${base}`
      : latestDate + `?base=${base}`;

    let currencyName = {};
    fetch(`https://openexchangerates.org/api/currencies.json`)
      .then(res => res.json())
      .then(res => {
        currencyName = res;
      });
    console.log(url);

    fetch(url)
      .then(function(res) {
        return res.json();
      })
      .then(function(res) {
        console.log(res);
        document.getElementById("base").innerHTML = "1 " + res.base;

        selectA.options.length = 0;
        selectB.options.length = 0;

        Object.keys(res.rates).map(function(objectKey, index) {
          const option = document.createElement("option");
          option.text = `${currencyNames[objectKey]} - ${objectKey}`;
          option.setAttribute("base", objectKey);
          option.value = res.rates[objectKey];

          selectA.append(option.cloneNode(true));

          selectB.append(option.cloneNode(true));

          let div = document.createElement("div");
          div.className = "row";
          let key = document.createElement("p");
          key.className = "currency";
          let val = document.createElement("p");
          val.className = "value";

          let countryFlag = document.createElement("img");
          let calcId = document.getElementById("calcInput");

          let value = res.rates[objectKey];
          key.textContent = objectKey;
          val.textContent = value;
          countryFlag.src =
            "https://www.countryflags.io/" +
            objectKey.slice(0, 2) +
            "/flat/32.png";
          div.appendChild(key);
          div.append(countryFlag);
          div.appendChild(val);
          // div.append(checkBox);
          let element = document.getElementById("rates");
          element.appendChild(div);
        });
        getExhangeDateRange();
        selectB.selectedIndex = currentBIndex;
        selectA.selectedIndex = currentAIndex;
        calc();
        resolve("ok");
      });

    let x = 1;

    inputA.addEventListener("input", newValue => {
      inputB.value = (
        Number.parseFloat(newValue.target.value) *
        Number.parseFloat(selectB.options[selectB.selectedIndex].value)
      )
        .toFixed(precision)
        .toString();
    });

    inputB.addEventListener("input", newValue => {
      x = 1 / Number.parseFloat(selectB.options[selectB.selectedIndex].value);
      inputA.value = (Number.parseFloat(newValue.target.value) * x)
        .toFixed(precision)
        .toString();
    });
  });
};

let getExhangeDateRange = function() {
  return new Promise(function(resolve, reject) {
    fetch(
      specificDate +
        `history?start_at=${formatDate(startDate)}&end_at=${formatDate(
          endDate
        )}&base=${baseA}&symbols=${selectB.options[
          selectB.selectedIndex
        ].getAttribute("base")}`
    )
      .then(res => res.json())
      .then(res => {
        let tmp = 0;
        let graphData = [];
        let labels = [];

        let arrayOfObj = Object.entries(res.rates).map(e => {
          return {
            time: e[0],
            value: Object.values(e[1])[0].toFixed(precision)
          };
        });

        arrayOfObj = arrayOfObj.sort(function(a, b) {
          var keyA = new Date(a.time),
            keyB = new Date(b.time);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        arrayOfObj.forEach(element => {
          graphData.push({
            t: new Date(element.time),
            y: element.value
          });
          labels.push(new Date(element.time).toLocaleDateString());
          tmp++;
        });

        myChart.data.datasets[0].label = baseA;

        myChart.data.datasets[0].labels = labels;
        myChart.data.datasets[0].data = graphData;

        myChart.update();
      })
      .catch(err => reject(err));
  });
};

window.addEventListener("load", function() {
  specificDateInput.max = formatDate(new Date());
  specificDateInput.min = formatDate(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  );

  specificDateInput.valueAsDate = new Date();

  console.log("document loaded");
  fetch("https://openexchangerates.org/api/currencies.json")
    .then(res => res.json())
    .then(res => {
      currencyNames = res;
    })
    .then(res => {
      getExchangeRates();
    });
});

specificDateInput.addEventListener("change", function(val) {
  getExchangeRates(
    new Date(document.getElementById("dateInput").value),
    selectA.options[selectA.selectedIndex].getAttribute("base")
  ).then(res => {
    selectB.selectedIndex = currentBIndex;
    selectA.selectedIndex = currentAIndex;
    calc();
  });
});

document
  .getElementById("latestButton")
  .addEventListener("click", function(val) {
    getExchangeRates(null, baseA);
    specificDateInput.valueAsDate = new Date();
  });

document.getElementById("selectA").addEventListener("change", e => {
  currentAIndex = selectA.selectedIndex;
  if (selectA.options[selectA.selectedIndex].getAttribute("base") === "EUR") {
    getExchangeRates(
      null,
      (base = selectA.options[selectA.selectedIndex].getAttribute("base"))
    ).then(res => {
      console.log(res);
      const option = document.createElement("option");
      option.text = `${"EURO"} - ${"EUR"}`;
      option.setAttribute("base", "EUR");
      option.value = 1;
      selectA.append(option);
      selectB.selectedIndex = currentBIndex;
      selectA.selectedIndex = selectA.length - 1;
      calc();
      getExhangeDateRange(startDate, endDate);
    });
  } else {
    getExchangeRates(
      null,
      (base = selectA.options[selectA.selectedIndex].getAttribute("base"))
    ).then(res => {
      console.log(res);
      selectB.selectedIndex = currentBIndex;
      selectA.selectedIndex = currentAIndex;
      calc();
      getExhangeDateRange(startDate, endDate);
    });
  }
});

document.getElementById("selectB").addEventListener("change", e => {
  currentBIndex = selectB.selectedIndex;
  calc();
  getExhangeDateRange(startDate, endDate);
});

// switchButton.addEventListener("click", () => {
//   let tmp = currentAIndex;
//   currentAIndex = currentBIndex;
//   currentBIndex = tmp;
//   selectA.selectedIndex = currentAIndex;
//   selectB.selectedIndex = currentBIndex;
//   console.log(selectA.options[selectA.selectedIndex].getAttribute("base"));
//   getExchangeRates(
//     null,
//     selectA.options[selectA.selectedIndex].getAttribute("base")
//   ).then(res => {
//     console.log("A " + currentAIndex);
//     console.log("B " + currentBIndex);

//     selectA.selectedIndex = currentAIndex;
//     selectB.selectedIndex = currentBIndex;
//     const inputTmp = inputA.value;
//     inputA.value = inputB.value;
//     inputB.value = inputTmp;

//     calc();
//   });
// });

$(function() {
  const minDate = new Date("2000-01-01T01:01:00");
  console.log(window.navigator.userLanguage || window.navigator.language);

  $('input[name="daterange"]').daterangepicker(
    {
      opens: "center",
      startDate: endDate,
      endDate: startDate
    },
    function(start, end, label) {
      startDate = start.toDate();
      endDate = end.toDate();
      getExhangeDateRange(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
    }
  );
});
