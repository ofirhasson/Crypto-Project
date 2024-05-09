"use strict";

(async () => {
    const coinsJson = await getJson("assets/json/coins.json");

    //create array of coins
    const coins = coinsJson.data.coins;
    //generate map for selected coins
    const selectedCoins = new Map();
    //creating variable of the graph interval for clearing the interval
    let graphInterval;

    displayCoins();

    //clear coins in local storage
    for (const coin of coins) {
        //if local storage empty break the loop
        if(window.localStorage.length === 0)
            break;
        localStorage.removeItem(coin.name);
    }

    const homeLink = document.getElementById("homeLink");
    homeLink.addEventListener("click", () => {
        try {
            clearGraphInterval();
            createHome();
        }
        catch (err) {
            //if home page cannot be create show error message
            showErrorMessage("Access is temporarily unavailable.", "Please try again later.");
        }
    });

    const reportsLink = document.getElementById("reportsLink");
    reportsLink.addEventListener("click", () => {
        try {
            createReports();
        }
        catch (err) {
            //if graph cannot be create show error message
            showErrorMessage("Access is temporarily unavailable.", "Please try again later.");
        }
    });

    const aboutLink = document.getElementById("aboutLink");
    aboutLink.addEventListener("click", () => {
        clearGraphInterval();
        createAbout();
    });

    //if graph already appeared clear the interval
    function clearGraphInterval() {
        if (graphInterval)
            clearInterval(graphInterval);
    }

    //displaying error message
    function showErrorMessage(firstPar, secondPar) {
        const divErrorMessage = document.getElementById("divErrorMessage");
        let html = "";
        html += `<img src="assets/images/bitcoinIcon.png"/>`;
        html += `<br><p>${firstPar}<br>${secondPar}</p>`
        divErrorMessage.innerHTML = html;
        divErrorMessage.style.display = "block";
    }

    //create home page
    async function createHome() {
        //hide graph container
        const chartContainer = document.getElementById("chartContainer");
        chartContainer.style = "height:0px";

        clearAllContainers();
        displayCoins();
    }

    //create reports page
    function createReports() {
        clearSearchAndButtonNavBar();
        clearAllContainers();
        createGraph();
    }

    //create about page
    function createAbout() {
        clearSearchAndButtonNavBar();
        clearAllContainers();
        //create about card
        const content = `<div class="card mb-3" style="max-width: 1400px;margin-top:8%;">
                            <div class="row g-0">
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">About Me</h5>
                                        <p class="card-text">My name is Ofir Hasson Hay.</p>
                                        <p class="card-text">I am 23 years old and currently studying to be fullstack software developer at John Bryce.</p>
                                        <p class="card-text">I have BSc of computer science that i finished in 2019.</p>
                                        <p class="card-text">As for today i know variety of subjects as: Javascript ,Typescript ,HTML ,CSS, React, Java, C, C++ and more .</p>
                                        <p class="card-text">In this website you can check on the best crypto coins as for today. You can check and learn about their prices and check on the graph that updates their value live.</p>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <img src="assets/images/me.jpg" class="img-fluid rounded-start" style="height: 100%;">
                                </div>
                            </div>
                        </div>`;

        container.innerHTML = content;
    }

    //clearing all containers
    function clearAllContainers() {
        const container = document.getElementById("container");
        container.innerHTML = "";
        const chartContainer = document.getElementById("chartContainer");
        chartContainer.innerHTML = "";
        const divErrorMessage = document.getElementById("divErrorMessage");
        divErrorMessage.innerHTML = "";
    }

    //clear search input and clear button at navBar 
    function clearSearchAndButtonNavBar() {
        const coinSearch = document.getElementById("coinSearch");
        coinSearch.style.display = "none";
        const clearCoinsButton = document.getElementById("clearCoinsButton");
        clearCoinsButton.style.display = "none";
    }


    //creating coins graph
    function createGraph() {
        if (selectedCoins.size === 0) {
            showErrorMessage("Graph cannot be create.", "Please check coins.");
            return;
        }
        //create array of selected coins
        const selectedCoinsArr = [];
        for (const keyValueArr of selectedCoins) {
            selectedCoinsArr.push(coins[keyValueArr[0]]);
        }

        let dataPoints1 = [], dataPoints2 = [], dataPoints3 = [], dataPoints4 = [], dataPoints5 = [];

        let name1, name2, name3, name4, name5;

        name1 = selectedCoinsArr[0] ? selectedCoinsArr[0].name : undefined;
        name2 = selectedCoinsArr[1] ? selectedCoinsArr[1].name : undefined;
        name3 = selectedCoinsArr[2] ? selectedCoinsArr[2].name : undefined;
        name4 = selectedCoinsArr[3] ? selectedCoinsArr[3].name : undefined;
        name5 = selectedCoinsArr[4] ? selectedCoinsArr[4].name : undefined;

        //create the graph
        let options = {
            title: {
                text: "Live Coins"
            },
            axisX: {
                title: "Time"
            },
            axisY: {
                title: "Value"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00$",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: name1 ? name1 : "",
                dataPoints: dataPoints1
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00$",
                showInLegend: true,
                name: name2 ? name2 : "",
                dataPoints: dataPoints2
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00$",
                showInLegend: true,
                name: name3 ? name3 : "",
                dataPoints: dataPoints3
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00$",
                showInLegend: true,
                name: name4 ? name4 : "",
                dataPoints: dataPoints4
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00$",
                showInLegend: true,
                name: name5 ? name5 : "",
                dataPoints: dataPoints5
            }]
        };

        $("#chartContainer").CanvasJSChart(options);

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

        let updateInterval = 2000;

        let time = new Date();

        async function updateChart() {

            time.setTime(time.getTime() + updateInterval);

            //create names string for the coins
            let coinsSymbolsString = "";
            for (const coin of selectedCoinsArr) {
                coinsSymbolsString += coin.symbol + ",";
            }
            coinsSymbolsString.substring(0, coinsSymbolsString.length - 1);

            const coinPrice = await getJson(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsSymbolsString}&tsyms=USD`);

            let yValue1, yValue2, yValue3, yValue4, yValue5;
            //if there is a coin update his value
            yValue1 = selectedCoinsArr[0] ? coinPrice[selectedCoinsArr[0].symbol.toUpperCase()].USD : undefined;
            yValue2 = selectedCoinsArr[1] ? coinPrice[selectedCoinsArr[1].symbol.toUpperCase()].USD : undefined;
            yValue3 = selectedCoinsArr[2] ? coinPrice[selectedCoinsArr[2].symbol.toUpperCase()].USD : undefined;
            yValue4 = selectedCoinsArr[3] ? coinPrice[selectedCoinsArr[3].symbol.toUpperCase()].USD : undefined;
            yValue5 = selectedCoinsArr[4] ? coinPrice[selectedCoinsArr[4].symbol.toUpperCase()].USD : undefined;

            // pushing the new values
            if (yValue1) {
                dataPoints1.push({
                    x: time.getTime(),
                    y: yValue1
                });
                options.data[0].legendText = name1 + " : " + yValue1 + "$";
            }
            if (yValue2) {
                dataPoints2.push({
                    x: time.getTime(),
                    y: yValue2
                });
                options.data[1].legendText = name2 + " : " + yValue2 + "$";
            }
            if (yValue3) {
                dataPoints3.push({
                    x: time.getTime(),
                    y: yValue3
                });
                options.data[2].legendText = name3 + " : " + yValue3 + "$";
            }
            if (yValue4) {
                dataPoints4.push({
                    x: time.getTime(),
                    y: yValue4
                });
                options.data[3].legendText = name4 + " : " + yValue4 + "$";
            }
            if (yValue5) {
                dataPoints5.push({
                    x: time.getTime(),
                    y: yValue5
                });
                options.data[4].legendText = name5 + " : " + yValue5 + "$";
            }
            $("#chartContainer").CanvasJSChart().render();
        }
        graphInterval = setInterval(function () { updateChart() }, updateInterval);
    }

    //display the coins at home page
    function displayCoins() {
        const container = document.getElementById("container");
        let content = "";

        //create card for every coin
        for (let i = 0; i < coins.length; i++) {
            const div = `
            <div class="card" style="width: 22rem;" id="card${i}">
                <div class="form-check form-switch">
                    <input class="form-check-input checkBoxInput" type="checkbox" role="switch" id="${i}">
                </div>
                <img src="${coins[i].iconUrl}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${coins[i].name}</h5>
                    <p class="card-text">${coins[i].symbol}</p>
                    <button class="btn btn-outline-dark" data-bs-target="#div${i}" type="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="div${i}" id="btn${i}" data-coin-id="${i}">More Info</button>
                    <div id="div${i}" class="collapse multi-collapse">
                        <div class="loader"></div>
                        <div class="moreInfoDiv"></div>
                    </div>
                </div>
            </div>
            `;

            content += div;
        }
        container.innerHTML = content;

        const buttons = document.querySelectorAll(".card-body > button");
        for (const btn of buttons) {
            btn.addEventListener("click", showPriceCoin);
        }

        const checkedBoxes = document.querySelectorAll(".checkBoxInput");
        for (const box of checkedBoxes) {
            if (selectedCoins.has(box.id))
                box.checked = true;
            box.addEventListener("change", checkSelectedCoins);
        }

        //search specific coin
        const coinSearch = document.getElementById("coinSearch");
        coinSearch.style.display = "block";
        coinSearch.addEventListener("input", checkSearchedData);

        const clearCoinsButton = document.getElementById("clearCoinsButton");
        clearCoinsButton.style.display = "block";
    }

    function checkSearchedData() {
        const coinToSearch = this.value;

        //hide error message container
        const divErrorMessage = document.getElementById("divErrorMessage");
        divErrorMessage.innerHTML = "";
        divErrorMessage.style.display = "none";

        //hide all the coins
        const cards = document.querySelectorAll(".card");
        for (const card of cards) {
            card.style.display = "none";
        }

        let isFound = false;

        //if coin name includes the value from search then show the coin
        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i].name;
            if (coin.toLowerCase().includes(coinToSearch.toLowerCase())) {
                const cardToShow = document.getElementById(`card${i}`);
                cardToShow.style.display = "inline-flex";
                isFound = true;
            }
        }
        //if coin not found show error message
        if (!isFound) {
            showErrorMessage("Coin not found.", "Please search another coin.");
        }
    }
    //create variable for the coin that will be deleted
    let valueToDelete;

    //create map for selected coins
    function checkSelectedCoins() {

        const coin = coins[this.id];
        const coinName = coin.name;

        //if coin not included and checkpoint checked add to selected coins map
        if (!selectedCoins.has(this.id) && this.checked) {
            selectedCoins.set(this.id, coinName);
        }

        //if coin included and checkpoint not checked delete from selected coins map
        if (selectedCoins.has(this.id) && !this.checked) {
            selectedCoins.delete(this.id);
        }

        if (selectedCoins.size === 6)
            createPopUpModal();
    }

    //creating pop up modal
    function createPopUpModal() {

        openModal();

        const modalContainer = document.getElementById("modalContainer");
        let html = "";

        for (const keyValueArray of selectedCoins) {
            const coinId = keyValueArray[0];
            const coin = coins[coinId];
            html += `<div class="buttonIconDiv"><button class="iconButton"><img src="${coin.iconUrl}">${coin.name}</button></div>`;
        }

        modalContainer.innerHTML = html;

        //mark the selected button
        const buttons = document.querySelectorAll(".buttonIconDiv > button");
        for (const btn of buttons) {
            btn.addEventListener("click", function () {
                for (const tempBtn of buttons) {
                    tempBtn.style.border = "";
                }
                this.style.border = "3px solid green";

                valueToDelete = this.innerText;
            });
        }
    }

    //save changes button
    const saveChangesModalBtn = document.getElementById("saveChangesModalBtn");
    saveChangesModalBtn.addEventListener("click", () => {
        const removeCoinPar = document.getElementById("removeCoinPar");
        //if user selected coin
        if (valueToDelete) {
            deleteCoin(valueToDelete);
            closeModal();
        }
        //if user hasn't selected coin
        else {
            removeCoinPar.style.animation = "bounce 2s";
            removeCoinPar.style.color = "red";
            setTimeout(() => {
                removeCoinPar.style.animation = "";
            }, 2000);
        }
        valueToDelete = undefined;
    });

    //close modal button
    const closeModalBtn = document.getElementById("closeModalBtn");
    closeModalBtn.addEventListener("click", () => {
        //delete the last item on select(the last coin selected)
        const buttons = document.querySelectorAll(".buttonIconDiv > button");
        deleteCoin(buttons[buttons.length - 1].innerText);

        //restart color of remove coin paragraph 
        const removeCoinPar = document.getElementById("removeCoinPar");
        removeCoinPar.style.color = "";

        closeModal();
    });

    //delete coin from map and uncheck input
    function deleteCoin(valueToDelete) {
        let inputId;

        for (const keyValueArray of selectedCoins) {
            const value = keyValueArray[1];

            if (value === valueToDelete) {
                inputId = keyValueArray[0];
            }
        }
        selectedCoins.delete(inputId);

        const inputToUnchecked = document.getElementById(`${inputId}`);
        if (inputToUnchecked)
            inputToUnchecked.checked = false;
    }

    //open modal
    function openModal() {

        document.getElementById("modal").style.display = "block";
        document.getElementById("checkedCoinsModal").style.display = "block";
        document.getElementById("checkedCoinsModal").classList.add("show");

    }

    //close modal
    function closeModal() {

        document.getElementById("modal").style.display = "none";
        document.getElementById("checkedCoinsModal").style.display = "none";
        document.getElementById("checkedCoinsModal").classList.remove("show");

    }

    //display the coin's price
    async function showPriceCoin() {
        const btnId = this.id;
        const divPrices = document.querySelector(`#${btnId}+div>div:last-of-type`);
        try {
            const divSpinner = document.querySelector(`#${btnId}+div>div:first-of-type`);

            const coin = coins[this.getAttribute("data-coin-id")];
            const prices = await getMoreInfo(coin);
            if (prices) {
                divSpinner.style.display = "none";
            }
            divPrices.innerHTML = `
                        <div>USD:${prices.usd}$</div>
                        <div>EUR:${prices.eur}€</div>
                        <div>ILS:${prices.ils}₪</div>
            `;
        }
        catch (err) {

            divPrices.innerHTML = "Coin not found.<br>Please try again later!";
        }

    }

    //get prices from json or local storage
    async function getMoreInfo(coin) {

        let prices = JSON.parse(localStorage.getItem(coin.name));
        if (prices) return prices;

        const coinPrice = await getJson(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin.symbol}&tsyms=USD`);
        const usdValue = await getJson(`https://api.exchangerate-api.com/v4/latest/USD`);
        const usd = coinPrice[coin.symbol.toUpperCase()].USD.toFixed(2);
        const eur = (usd * usdValue.rates.EUR).toFixed(2);
        const ils = (usd * usdValue.rates.ILS).toFixed(2);
        prices = { usd, eur, ils };

        localStorage.setItem(coin.name, JSON.stringify(prices));
        //delete every coin after two minutes
        setTimeout(() => { localStorage.removeItem(coin.name) }, 120000);
        return prices;
    }

    //get json from api
    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    const clearCoinsButton = document.getElementById("clearCoinsButton");
    clearCoinsButton.addEventListener("click", () => {
        selectedCoins.clear();
        const checkedBoxes = document.querySelectorAll(".checkBoxInput");
        for (const box of checkedBoxes) {
            box.checked = false;
        }
    });

})();