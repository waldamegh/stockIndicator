const db = require('../../models/dbHelpers');

const getAllStocksService = async () => {
  try {
    console.log('===Getting All Stocks from DB ....');
    const allStocks = await db.getAllStocks();
    if (allStocks.length > 0) {
      console.log('===Returning Stocks to Controller');
      return allStocks;
    } else {
      console.log('===Stock Table Empty');
      return "Stocks Table Empty";
    }
  } catch (error) {
    throw new Error(`===Error getting stocks from DB, Error: ${error}`);
  }
}

const getStockInfoService = async (symbol) => {
  try {
    console.log('===Getting Stock Info from DB ....');
    var stockInfo = await db.findStockById(symbol);
    if (stockInfo) {
      console.log('===Returning Stock Info to Controller');
      return stockInfo;
    } else {
      console.log('===Stock not found');
      return "Stock not found";
    }
  } catch (error) {
    throw new Error(`===Error getting stock info from DB, Error: ${error}`);
  }
}

const fetchStockPriceService = async (symbol, fromDate, toDate) => {
  try {
    let stockPriceArray = [];
    const stockPrice = await db.findStockPriceByIdFromToDate(symbol, fromDate, toDate);
    if (stockPrice) {
      console.log('===Fetching Date & Price of stock');
      stockPrice.forEach((price) => {
        stockPriceArray.push({ date: price.dayDate, price: price.closePrice });
      });
      console.log(`stock fitched = ${JSON.stringify(stockPriceArray)}`)
      return stockPriceArray;
    } else {
      console.log('===Stock Price Not Found');
      return "Stock Price Not Found";
    }
  } catch (error) {
    throw new Error(`===Error fetching stock price, Error: ${error}`);
  }
}

const getDate = (num) => {
  let dateValue = new Date();
  dateValue.setDate(dateValue.getDate() - num);
  return dateValue.toISOString().split('T')[0];
}

module.exports = { getAllStocksService, getStockInfoService, fetchStockPriceService, getDate };