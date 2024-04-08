const express = require('express');
const {getAllStocksService, getStockInfoService, fetchStockPriceService} = require('./stocksService');

const getAllStocks = async (req, res) => {
    try {
        const stocks = await getAllStocksService();
        res.status(200).json({ stocks });
        console.log('===Get All Stocks -> Done');
    } catch (error) {
        console.log(`===Error getting stocks from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stocks from DB" });
    }
};

const getStockInfo = async (req, res) => {
    const symbol = req.params.symbol;
    console.log(`===Stock symbol is ${symbol}`)
    try {
        const stock = await getStockInfoService(symbol);
        res.status(200).json({ stock });
        console.log('===Get Stock Info -> Done');
    } catch (error) {
        console.log(`===Error getting stock info from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock info from DB" });
    }
};

const getStockPrice = async(req, res) =>{
    const symbol = req.params.symbol;
    console.log(`===Stock symbol is ${symbol}`)
    try {
        const stockPrice = await fetchStockPriceService(symbol);
        res.status(200).json({ stockPrice });
        console.log('===Get Stock Price -> Done');
    } catch (error) {
        console.log(`===Error getting stock price from Service, Error: ${error}`)
        res.status(500).json({ message: "Error: unable to get stock price from DB" });
    }
}

module.exports = {getAllStocks, getStockInfo, getStockPrice};