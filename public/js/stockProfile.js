let currency = '$';
$(document).ready(function () {
    var symbol = sessionStorage.getItem('symbol');
    if (symbol == null) {
        window.location.replace('../stocks');
    }
    //Fetch stock info
    fetch(`http://164.90.238.80:3000/stocks/${symbol}`, {
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
                                                                        <a href="./." class="btn btn-primary">
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
        var stock = data.stock;
        $("#stockLogo").attr('src', `../images/stockLogo/${symbol}.png`);
        document.getElementById("stockSymbol").innerHTML = `${stock.symbol} <a href="${stock.website}" target="_blank" rel="noreferrer" class=""><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-external-link"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg></a>
                                            <div class=\"text-muted\">${stock.name}</div> `;
        document.getElementById("stockMarket").innerHTML = stock.marketName;
        document.getElementById("stockIndustry").innerHTML = stock.industry;
        document.getElementById("stockSector").innerHTML = stock.sector;
        document.getElementById("stockDescription").innerHTML = stock.description;
        if (stock.currency != 'USD') {
            currency = stock.currency;
        }
        //Price Chart
        //fetch price data
        let stockPrice = [];
        fetch(`http://164.90.238.80:3000/stocks/price/${symbol}`, {
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
                                                                        <a href="./." class="btn btn-primary">
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
            stockPrice = data.stockPrice;
            //set price and precent values
            document.getElementById("stockPrice").innerHTML = `${stockPrice[stockPrice.length - 1].price} ${currency}`;
            if (stockPrice[stockPrice.length - 1].changePercent > 0) {
                document.getElementById("stockPricePercentageGreen").innerHTML = `+ ${stockPrice[stockPrice.length - 1].changePercent} %`;
                $('#stockPricePercentageGreen').show();
                $('#stockPricePercentageRed').hide();
                $('#stockPricePercentageGray').hide();
                $('#stockPriceStatusGreen').show();
                $('#stockPriceStatusRed').hide();
                $('#stockPriceStatusGray').hide();
            } else if (stockPrice[stockPrice.length - 1].changePercent < 0) {
                document.getElementById("stockPricePercentageRed").innerHTML = `${stockPrice[stockPrice.length - 1].changePercent} %`;
                $('#stockPricePercentageGreen').hide();
                $('#stockPricePercentageRed').show();
                $('#stockPricePercentageGray').hide();
                $('#stockPriceStatusGreen').hide();
                $('#stockPriceStatusRed').show();
                $('#stockPriceStatusGray').hide();
            } else {
                document.getElementById("stockPricePercentageGray").innerHTML = `${stockPrice[stockPrice.length - 1].changePercent} %`;
                $('#stockPricePercentageGreen').hide();
                $('#stockPricePercentageRed').hide();
                $('#stockPricePercentageGray').show();
                $('#stockPriceStatusGreen').hide();
                $('#stockPriceStatusRed').hide();
                $('#stockPriceStatusGray').show();
            }
            //get price and date values for chart
            let stockPriceX = []
            let stockPriceY = [];
            let lineData = [];
            for (let i = 0; i < stockPrice.length; i++) {
                stockPriceX.push(stockPrice[i].date);
            }
            for (let i = 0; i < stockPrice.length; i++) {
                lineData.push(stockPrice[i].price);
            }
            stockPriceY.push({ name: "Stock Price", data: lineData });
            stockPriceChart(stockPriceX, stockPriceY);
        }).catch(error => console.error('Frontend:Fetch Stock Price, Error:', error));
    }).catch(error => console.error('Frontend:Fetch Stock info, Error:', error));
    //Indicator section
    //show and hide Moving Avarage Indicators based on the selected MA Crossover Strategy
    $("[id^='radioStrategy']").on("click", function () {
        var divElements = $("[class^=radioStrategy]")
        var radioBtn = this.id;
        divElements.each(function (index, element) {
            if (element.classList.contains(radioBtn)) {
                $(element).show();
            } else {
                $(element).hide();
            }
        })
    });
    //validate and get values of Indicator Settings
    $("#applyStrategy").on("click", function () {
        var duration = $("input:radio[name=btnDuration]:checked").val();
        var strategy = $("input:radio[name=strategyRadio]:checked").val();
        var short, mid, long;
        var isValid = true;
        var request = { symbol: symbol, strategy: strategy, toDate: getDate(1) }
        if (strategy == 'TripleMovingAverageCrossover') {
            if ($('#daysShort').val() == '') {
                $('#shortErrMsg').show();
                isValid = false;
            } else {
                $('#shortErrMsg').hide();
            }
            if ($('#daysMid').val() == '') {
                $('#midErrMsg').show();
                isValid = false;
            } else {
                $('#midErrMsg').hide();
            }
            if ($('#daysLong').val() == '') {
                $('#longErrMsg').show();
                isValid = false;
            } else {
                $('#longErrMsg').hide();
            }
            if (isValid) {
                short = { type: $('#selectShortMAIndicator').val(), numDays: $('#daysShort').val() }
                mid = { type: $('#selectMidMAIndicator').val(), numDays: $('#daysMid').val() }
                long = { type: $('#selectLongMAIndicator').val(), numDays: $('#daysLong').val() }
                request.short = short;
                request.mid = mid;
                request.long = long;
            }
        } else if (strategy == 'DoubleMovingAverageCrossover') {
            if ($('#daysShort').val() == '') {
                $('#shortErrMsg').show();
                isValid = false;
            } else {
                $('#shortErrMsg').hide();
            }
            if ($('#daysLong').val() == '') {
                $('#longErrMsg').show();
                isValid = false;
            } else {
                $('#longErrMsg').hide();
            }
            if (isValid) {
                short = { type: $('#selectShortMAIndicator').val(), numDays: $('#daysShort').val() }
                long = { type: $('#selectLongMAIndicator').val(), numDays: $('#daysLong').val() }
                request.short = short;
                request.long = long;
            }
        } else {
            if ($('#daysShort').val() == '') {
                $('#shortErrMsg').show();
                isValid = false;
            } else {
                $('#shortErrMsg').hide();
            }
            if (isValid) {
                short = { type: $('#selectShortMAIndicator').val(), numDays: $('#daysShort').val() }
                request.short = short;
            }
        }
        if (duration === 'week') {
            request.fromDate = getDate(7);
        } else if (duration === 'month') {
            request.fromDate = getDate(30);
        } else if (duration === '3months') {
            request.fromDate = getDate(90);
        } else if (duration === '6months') {
            request.fromDate = getDate(180);
        } else if (duration === 'yesr') {
            request.fromDate = getDate(365);
        } else {
            request.fromDate = getDate(730);
        }
        if (isValid) {
            console.log(`request is ${JSON.stringify(request)}`);
            //fetch MA data
            let stockPrice = [];
            fetch('http://164.90.238.80:3000/stocks/movingAverage', {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data)
                if (data.signal === 'sell') {
                    $('#stockSignalBuy').hide();
                    $('#stockSignalSell').show();
                    $('#stockSignalHold').hide();
                } else if (data.signal === 'buy') {
                    $('#stockSignalBuy').show();
                    $('#stockSignalSell').hide();
                    $('#stockSignalHold').hide();
                } else {
                    $('#stockSignalBuy').hide();
                    $('#stockSignalSell').hide();
                    $('#stockSignalHold').show();
                }
                let stockPriceX = []
                let stockPriceY = [];
                let lineData = [];
                for (let i = 0; i < data.stockPrice.length; i++) {
                    stockPriceX.push(data.stockPrice[i].date);
                }
                if (data.stockPrice) {
                    lineData = [];
                    for (let i = 0; i < data.stockPrice.length; i++) {
                        lineData.push({ x: data.stockPrice[i].date, y: data.stockPrice[i].price });
                    }
                    stockPriceY.push({ name: "Stock Price", data: lineData })
                }
                if (data.movingAverageResultShort) {
                    lineData = [];
                    for (let i = 0; i < data.movingAverageResultShort.length; i++) {
                        lineData.push({ x: data.movingAverageResultShort[i].date, y: data.movingAverageResultShort[i].value });
                    }
                    stockPriceY.push({ name: "Shorter Term MA", data: lineData })
                }
                if (data.movingAverageResultMid) {
                    lineData = [];
                    for (let i = 0; i < data.movingAverageResultMid.length; i++) {
                        lineData.push({ x: data.movingAverageResultMid[i].date, y: data.movingAverageResultMid[i].value });
                    }
                    stockPriceY.push({ name: "Mid Term MA ", data: lineData })
                }
                if (data.movingAverageResultLong) {
                    lineData = [];
                    for (let i = 0; i < data.movingAverageResultLong.length; i++) {
                        lineData.push({ x: data.movingAverageResultLong[i].date, y: data.movingAverageResultLong[i].value });
                    }
                    stockPriceY.push({ name: "Longer Term MA ", data: lineData })
                }
                console.log(stockPriceY)
                stockPriceChart(stockPriceX, stockPriceY);
            }).catch(error => console.error('Frontend:Fetch Stock Price, Error:', error));
        } else {
            console.log('invalid req')
        }
    });
    /*FUNCTION Start*/
    //stock price char function for displaying chart 
    function stockPriceChart(dataXaxis, dataYaxis) {
        document.getElementById("chart-demo-line").innerHTML = "";
        window.ApexCharts && (new ApexCharts(document.getElementById('chart-demo-line'), {
            chart: {
                type: "line",
                fontFamily: 'inherit',
                height: 240,
                parentHeightOffset: 0,
                toolbar: {
                    show: false,
                },
                animations: {
                    enabled: true
                },
            },
            fill: {
                opacity: 1,
            },
            stroke: {
                width: 2,
                lineCap: "round",
                curve: "straight",
            },
            series: dataYaxis,
            tooltip: {
                theme: 'dark'
            },
            grid: {
                padding: {
                    top: -20,
                    right: 0,
                    left: -4,
                    bottom: -4
                },
                strokeDashArray: 4,
            },
            xaxis: {
                labels: {
                    padding: 0,
                },
                tooltip: {
                    enabled: false
                },
                type: 'datetime',
            },
            yaxis: {
                labels: {
                    padding: 4,
                    formatter: function (value) {
                        return `${(value).toFixed(1)}  ${currency}`;
                    }
                },
            },
            labels: dataXaxis,
            colors: [tabler.getColor("primary"), tabler.getColor("green"), tabler.getColor("yellow"), tabler.getColor("purple")],
            legend: {
                show: true,
                position: 'bottom',
                offsetY: 12,
                markers: {
                    width: 10,
                    height: 10,
                    radius: 100,
                },
                itemMargin: {
                    horizontal: 8,
                    vertical: 8
                },
            },
        })).render();
    }
    /*FUNCTION End*/
    /*FUNCTION Start*/
    //function to get date
    const getDate = (num) => {
        let dateValue = new Date();
        dateValue.setDate(dateValue.getDate() - num);
        return dateValue.toISOString().split('T')[0];
    }
    /*FUNCTION End*/
    //get current year for footer
    document.getElementById("copyright-year").innerHTML = `${new Date().getFullYear()}`;
});