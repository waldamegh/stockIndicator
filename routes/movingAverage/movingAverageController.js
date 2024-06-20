const {movingAverageService, movingAveragePrecheck} = require('./movingAverageService');
const db = require('../../models/dbHelpers');
const { getDate } = require('../stocks/stocksService');

const movingAverageController = async (req, res) => {
    //validate fromDate & toDate with database records
    await movingAveragePrecheck((req.body.symbol).toUpperCase());
    const oldestDate = await db.findOldestStockPrice((req.body.symbol).toUpperCase());
    if (req.body.fromDate < oldestDate.dayDate || req.body.toDate < oldestDate.dayDate) {
        console.log(`oldestDate.dayDate ${oldestDate.dayDate}`)
        console.log(`req.body.fromDate ${req.body.fromDate}`)
        console.log(`req.body.toDate ${req.body.toDate}`)
        console.log('===Error fromDate is older than stock date in the db')
        res.status(500).json({ message: `Error: fromDate and toDate are not suitable to the data we have, it must be a date after or equal (${oldestDate.dayDate})` });
        return;
    }
    //call stratgy function
    if ((req.body.strategy).toLowerCase() === 'doublemovingaveragecrossover') {
        await doubleMovingAverageCrossover(req, res);
    } else if ((req.body.strategy).toLowerCase() === 'triplemovingaveragecrossover') {
        await tripleMovingAverageCrossover(req, res);
    } else if ((req.body.strategy).toLowerCase() === 'pricecrossover') {
        await priceCrossover(req, res);
    } else {
        res.status(400).send({ error: 'invalid request' });
    }
};
//function for calculating SMA
const smaCalc = async (stockPrice, numDays, stockPriceOriginal) => {
    let sma = [];
    //calc sma
    console.log('===Start sma');
    for (let i = 0; i < stockPrice.length; i++) {
        let sum = 0;
        for (let j = 0; j < numDays; j++) {
            sum += stockPriceOriginal[j + i].price
        }
        sma.push({ date: stockPrice[i].date, value: ((sum / numDays)).toFixed(2) });
    }
    //send sma result
    console.log('===sma -> Done');
    return sma;
}
//fuction for calculating EMA
const emaCalc = async (stockPrice, numDays, stockPriceOriginal) => {
    let ema = [];
    //calc ema
    console.log('===Start ema -> Done');
    console.log('===Intial ema is sma ')
    let sma = await smaCalc(stockPrice, numDays, stockPriceOriginal);
    ema.push({ date: sma[0].date, value: sma[0].value });
    let k = 2 / (numDays + 1)
    console.log(`k is ${k}`)
    for (let i = 1; i < stockPrice.length; i++) {
        ema.push({ date: stockPrice[i].date, value: ((stockPrice[i].price * k) + (ema[i - 1].value * (1 - k))).toFixed(2) });
    }
    console.log('===ema -> Done')
    return ema;
}
//Crossover statgy functions
//fuction returns JSON for price & sma/ema
const priceCrossover = async (req, res) => {
    //get request data
    const symbol = (req.body.symbol).toUpperCase();
    const numDays = req.body.short.numDays;
    const fromDate = req.body.fromDate || getDate(7, false);
    const toDate = req.body.toDate || getDate(1, true);
    console.log(`===fromDate is ${fromDate} & toDate is ${toDate}`);
    try {
        //set variables
        let stockPrice = [];
        let movingAverageResult = [];
        let signal = "Hold";
        //fetch stock price
        const stockPriceOriginal = await movingAverageService(symbol, fromDate, toDate);
        //validate numDays
        if (!(stockPriceOriginal.length > numDays)) {
            console.log('===Error numDays is more than number of stock price in the db')
            res.status(500).json({ message: `Error: numDays is not suitable to the data we have, it must be less than ${stockPriceOriginal.length}` });
            return;
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDays - 1);
        //calc moving avarage
        if ((req.body.short.type).toLowerCase() === 'sma') {
            movingAverageResult = await smaCalc(stockPrice, numDays, stockPriceOriginal);
        } else if ((req.body.short.type).toLowerCase() === 'ema') {
            movingAverageResult = await emaCalc(stockPrice, numDays, stockPriceOriginal);
        }
        //calc buy/sell signal
        if (movingAverageResult[movingAverageResult.length - 1].value < stockPriceOriginal[stockPriceOriginal.length - 1].price) {
            signal = "buy";
        } else if (movingAverageResult[movingAverageResult.length - 1].value > stockPriceOriginal[stockPriceOriginal.length - 1].price) {
            signal = "sell";
        }
        //send moving avarage result
        console.log('===priceCrossover -> Done')
        res.status(200).json({ stockPrice: stockPriceOriginal, movingAverageResultShort: movingAverageResult, signal: signal });
    } catch (error) {
        console.log(`===Error getting stock price, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price" });
    }
}
//function rturns two moving avrage (sma/ema) & price
const doubleMovingAverageCrossover = async (req, res) => {
    //get request data
    const symbol = (req.body.symbol).toUpperCase();
    const numDaysShort = req.body.short.numDays;
    const numDaysLong = req.body.long.numDays;
    const fromDate = req.body.fromDate || getDate(7, false);
    const toDate = req.body.toDate || getDate(1, true);
    console.log(`===fromDate is ${fromDate} & toDate is ${toDate}`);
    try {
        //set variables
        let stockPrice = [];
        let movingAverageResultShort = [];
        let movingAverageResultLong = [];
        let signal = "Hold";
        //fetch stock price
        const stockPriceOriginal = await movingAverageService(symbol, fromDate, toDate);
        //validate numDays
        if (!(stockPriceOriginal.length > numDaysShort || stockPriceOriginal.length > numDaysLong)) {
            console.log('===Error numDays is more than number of stock price in the db')
            res.status(500).json({ message: `Error: numDays is not suitable to the data we have, it must be less than ${stockPriceOriginal.length}` });
            return;
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDaysShort - 1);
        //calc moving avarage (short)
        if ((req.body.short.type).toLowerCase() === 'sma') {
            movingAverageResultShort = await smaCalc(stockPrice, numDaysShort, stockPriceOriginal);
        } else if ((req.body.short.type).toLowerCase() === 'ema') {
            movingAverageResultShort = await emaCalc(stockPrice, numDaysShort, stockPriceOriginal);
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDaysLong - 1);
        //calc moving avarage (long)
        if ((req.body.long.type).toLowerCase() === 'sma') {
            movingAverageResultLong = await smaCalc(stockPrice, numDaysLong, stockPriceOriginal);
        } else if ((req.body.long.type).toLowerCase() === 'ema') {
            movingAverageResultLong = await emaCalc(stockPrice, numDaysLong, stockPriceOriginal);
        }
        //calc buy/sell signal
        if (movingAverageResultShort[movingAverageResultShort.length - 1].value < movingAverageResultLong[movingAverageResultLong.length - 1].value) {
            signal = "buy";
        } else if (movingAverageResultShort[movingAverageResultShort.length - 1].value > movingAverageResultLong[movingAverageResultLong.length - 1].value) {
            signal = "sell";
        }
        //send moving avarage result
        console.log('===doubleMovingAverageCrossover -> Done')
        res.status(200).json({ stockPrice: stockPriceOriginal, movingAverageResultShort: movingAverageResultShort, movingAverageResultLong: movingAverageResultLong, signal: signal });
    } catch (error) {
        console.log(`===Error getting stock price, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price" });
    }
}
//function rturns three moving avrage (sma/ema) & price
const tripleMovingAverageCrossover = async (req, res) => {
    //get request data
    const symbol = (req.body.symbol).toUpperCase();
    const numDaysShort = req.body.short.numDays;
    const numDaysLong = req.body.long.numDays;
    const numDaysMid = req.body.mid.numDays;
    const fromDate = req.body.fromDate || getDate(7, false);
    const toDate = req.body.toDate || getDate(1, true);
    console.log(`===fromDate is ${fromDate} & toDate is ${toDate}`);
    try {
        //set variables
        let stockPrice = [];
        let movingAverageResultShort = [];
        let movingAverageResultLong = [];
        let movingAverageResultMid = [];
        let signal = "Hold";
        //fetch stock price
        const stockPriceOriginal = await movingAverageService(symbol, fromDate, toDate);
        //validate numDays
        if (!(stockPriceOriginal.length > numDaysShort || stockPriceOriginal.length > numDaysLong || stockPriceOriginal.length > numDaysMid)) {
            console.log('===Error numDays is more than number of stock price in the db')
            res.status(500).json({ message: `Error: numDays is not suitable to the data we have, it must be less than ${stockPriceOriginal.length}` });
            return;
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDaysShort - 1);
        //calc moving avarage (short)
        if ((req.body.short.type).toLowerCase() === 'sma') {
            movingAverageResultShort = await smaCalc(stockPrice, numDaysShort, stockPriceOriginal);
        } else if ((req.body.short.type).toLowerCase() === 'ema') {
            movingAverageResultShort = await emaCalc(stockPrice, numDaysShort, stockPriceOriginal);
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDaysLong - 1);
        //calc moving avarage (long)
        if ((req.body.long.type).toLowerCase() === 'sma') {
            movingAverageResultLong = await smaCalc(stockPrice, numDaysLong, stockPriceOriginal);
        } else if ((req.body.long.type).toLowerCase() === 'ema') {
            movingAverageResultLong = await emaCalc(stockPrice, numDaysLong, stockPriceOriginal);
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDaysMid - 1);
        //calc moving avarage (mid)
        if ((req.body.mid.type).toLowerCase() === 'sma') {
            movingAverageResultMid = await smaCalc(stockPrice, numDaysMid, stockPriceOriginal);
        } else if ((req.body.Mid.type).toLowerCase() === 'ema') {
            movingAverageResultMid = await emaCalc(stockPrice, numDaysMid, stockPriceOriginal);
        }
        //calc buy/sell signal
        if ((movingAverageResultShort[movingAverageResultShort.length - 1].value > movingAverageResultLong[movingAverageResultLong.length - 1].value) && (movingAverageResultMid[movingAverageResultMid.length - 1].value > movingAverageResultLong[movingAverageResultLong.length - 1].value)) {
            signal = "buy";
        } else if ((movingAverageResultShort[movingAverageResultShort.length - 1].value < movingAverageResultLong[movingAverageResultLong.length - 1].value) && (movingAverageResultMid[movingAverageResultMid.length - 1].value < movingAverageResultLong[movingAverageResultLong.length - 1].value)) {
            signal = "sell";
        }
        //send moving avarage result
        console.log('===doubleMovingAverageCrossover -> Done')
        res.status(200).json({ stockPrice: stockPriceOriginal, movingAverageResultShort: movingAverageResultShort, movingAverageResultMid: movingAverageResultMid, movingAverageResultLong: movingAverageResultLong, signal: signal });
    } catch (error) {
        console.log(`===Error getting stock price, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price" });
    }
}
module.exports = movingAverageController;