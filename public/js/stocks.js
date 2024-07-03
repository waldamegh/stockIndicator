
window.onload = () => {
    //Fetch stock info
    fetch(`http://164.90.238.80:3000/stocks?price=enabled`, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            document.getElementById('pageBody').innerHTML = `<div class="empty container-tight">
                                                                <div class="empty-header">${response.status}</div>
                                                                <p class="empty-title">Oops :'(</p>
                                                                <p class="empty-subtitle text-muted">
                                                                    We are sorry but something went wrong!
                                                                </p>
                                                                <div class="empty-action">
                                                                    <a href="/" class="btn btn-primary">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" 
                                                                    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" />
                                                                    <path d="M5 12l6 -6" /></svg>
                                                                    Take me home
                                                                    </a>
                                                                </div>
                                                                </div>`;
        }
    }).then(function (data) {
        const stocks = data.stocks;
        document.getElementById('stocksList').innerHTML="";
        for (let i = 0; i < Object.entries(stocks).length; i++) {
            //div list group item
            divL1 = document.createElement("div");
            divL1.setAttribute("class", "list-group-item");
            divL1.setAttribute("style", "cursor: pointer;");
            divL1.setAttribute("id", `stockSymbol_${i}`);
            divL1.setAttribute("value", `${stocks[i].symbol}`);
            divL2 = document.createElement("div");
            divL2.setAttribute("class", "row g-2 align-items-center");
            //div image
            divL3_1 = document.createElement("div");
            divL3_1.setAttribute("class", "col-auto");
            divL3_1.setAttribute("style", "filter:drop-shadow(2px 2px 2px rgb(162, 167, 193));")
            divL3_1.innerHTML = `<img src="/images/stockLogo/${stocks[i].symbol}.png" class="rounded" alt="stock symbol" width="40" height="40">`
            //div symbol and company name
            divL3_2 = document.createElement("div");
            divL3_2.setAttribute("class", "col");
            divL3_2.innerHTML = stocks[i].symbol;
            divL3_2_1 = document.createElement("div");
            divL3_2_1.setAttribute("class", "text-muted");
            divL3_2_1.innerHTML = stocks[i].name;
            //div sector and market name
            divL3_3 = document.createElement("div");
            divL3_3.setAttribute("class", "col-auto");
            divL3_3.setAttribute("style", "color: #667382;");
            divL3_3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="icon icon-tabler icons-tabler-outline icon-tabler-hexagons">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 18v-5l4 -2l4 2v5l-4 2z" />
                                                    <path d="M8 11v-5l4 -2l4 2v5" />
                                                    <path d="M12 13l4 -2l4 2v5l-4 2l-4 -2" />
                                                </svg> ${stocks[i].sector}`;
            divL3_3_1 = document.createElement("div");
            divL3_3_1.setAttribute("class", "text-muted datagrid-title");
            divL3_3_1.setAttribute("style", "padding-left: 25px; color: #667382;");
            divL3_3_1.innerHTML = stocks[i].marketName;
            //div price
            divL3_4 = document.createElement("div");
            divL3_4.setAttribute("class", "col-auto text-muted");
            divL3_4.setAttribute("style", "padding-right: 20px; padding-left: 20px;");
            if (stocks[i].currency != 'USD') {
                divL3_4.innerHTML = `${stocks[i].price[0].price} ${stocks[i].currency}`;
            } else {
                divL3_4.innerHTML = `${stocks[i].price[0].price} $`;
            }
            //div chart
            divL3_5 = document.createElement("div");
            divL3_5.setAttribute("class", "col-auto text-muted");
            divL3_5.setAttribute("style", "padding-right: 30px;");
            divL3_5_1 = document.createElement("div");
            divL3_5_1.setAttribute("class", "chart-sparkline chart-sparkline-sm");
            divL3_5_1.setAttribute("id", `sparkline-bounce-rate-${i}`);
            //addpend div
            divL3_5.appendChild(divL3_5_1);
            divL3_3.appendChild(divL3_3_1);
            divL3_2.appendChild(divL3_2_1);
            divL2.appendChild(divL3_1);
            divL2.appendChild(divL3_2);
            divL2.appendChild(divL3_3);
            divL2.appendChild(divL3_4);
            divL2.appendChild(divL3_5);
            divL1.appendChild(divL2);
            document.getElementById('stocksList').appendChild(divL1);
            //on click
            document.getElementById(`stockSymbol_${i}`).addEventListener("click", () => {
                sessionStorage.setItem('symbol', document.getElementById(`stockSymbol_${i}`).getAttribute("value"));
                window.location.replace('./stocks/stockProfile');
            });
            //get price for chart
            let price = [];
            stocks[i].price.forEach(element => {
                price.push(element.price)
            });
            //call chart function to display mini chart
            minChart(document.getElementById(`sparkline-bounce-rate-${i}`), price);
        }
    }).catch(error => console.error('Frontend:Fetch Stock info, Error:', error));
}
/*FUNCTION Start*/
//stock price char function for displaying chart in min size
function minChart(elementId, price) {
    window.ApexCharts && (new ApexCharts(elementId, {
        chart: {
            type: "line",
            fontFamily: 'inherit',
            height: 24,
            width: 100.0,
            animations: {
                enabled: true
            },
            sparkline: {
                enabled: true
            },
        },
        tooltip: {
            enabled: false,
        },
        stroke: {
            width: 2,
            lineCap: "round",
        },
        series: [{
            color: tabler.getColor("primary"),
            data: price
        }],
    })).render();
}
/*FUNCTION End*/
//get current year for footer
document.getElementById("copyright-year").innerHTML = `${new Date().getFullYear()}`;