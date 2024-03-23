const express = require('express');
const smaService = require('./smaService');

const smaCalc = async (req, res) => {
    //get request data
    const symbol = req.body.symbol;
    const numDays = req.body.numDays;
    try {
        const stockPriceOriginal = await smaService(symbol);
        let stockPrice = [];
        let sma = [];
        //validate numDays
        if (!(stockPriceOriginal.length > numDays)) {
            console.log('===Error numDays is more than number of stock price in the db')
            res.status(500).json({ message: `Error: numDays is not suitable to the data we have, it must be less than ${stockPriceOriginal.length}` });
            return;
        }
        //store sub stock price
        stockPrice = stockPriceOriginal.slice(numDays);
        //calc sma
        for (let i = 0; i < stockPrice.length; i++) {
            let sum = 0;
            for (let j = 0; j < numDays; j++) {
                sum += stockPriceOriginal[j + i].price
            }
            sma.push({ date: stockPrice[i].date, value: (sum / numDays) });
        }
        //send sma result
        console.log('===SMA -> Done')
        res.status(200).json({ stockPrice: stockPriceOriginal, sma: sma });
    } catch (error) {
        console.log(`===Error getting stock price, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price" });
    }
};
module.exports = smaCalc;