var apiKey = require('../../config/fmpKey.json');
const db = require('../../models/dbHelpers');
const { fetchStockPriceService, addStockPrice, addStock, updateStockPrice } = require('../stocks/stocksService');

const findStock = async (symbol) => {
  try {
    const findStockResult = await db.findStockById(symbol);
    return (findStockResult);
  } catch (error) {
    throw new Error(`===Error finding Stock, Error: ${error}`);
  }
}

const movingAveragePrecheck = async (symbol) => {
  try {
    //find stock in db
    console.log('===Finding Stock ...');
    const stock = await findStock(symbol);
    if (!stock) {
      //add stock if it is not exist
      console.log('===Stock DOES NOT Exist');
      await addStock(symbol);
      console.log('===Stock Added');
      await addStockPrice(symbol);
      console.log('===Stock Price Added');
    } else {
      //if the stock exist in db
      console.log('===Stock Exist');
      //console.log(stock);
      await updateStockPrice(symbol);
    }
  } catch (error) {
    throw new Error(`===Error MA precheck, Error: ${error}`);
  }
}

const movingAverageService = async (symbol, fromDate, toDate) => {
  try {
    console.log('===Fetching Stock Price ...');
    const stockPrice = await fetchStockPriceService(symbol, fromDate, toDate);
    return stockPrice;
  } catch (error) {
    throw new Error(`===Error moving average service, Error: ${error}`);
  }
}

module.exports = {movingAverageService, movingAveragePrecheck};