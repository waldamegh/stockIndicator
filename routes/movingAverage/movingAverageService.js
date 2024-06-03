var apiKey = require('../../config/fmpKey.json');
const db = require('../../models/dbHelpers');
const { fetchStockPriceService, getDate, getStockPrice, addStockPrice, addStock } = require('../stocks/stocksService');

const findStock = async (symbol) => {
  try {
    const findStockResult = await db.findStockById(symbol);
    return (findStockResult);
  } catch (error) {
    throw new Error(`===Error finding Stock, Error: ${error}`);
  }
}

const addMissingStockPrice = async (symbol, lastDate) => {
  try {
    const stockPriceData = await getStockPrice(symbol);
    if (stockPriceData.length > 0) {
      console.log("===Adding Missing Stock Price ...");
      //console.log(stockPriceData)
      //add price into db
      for (let i = (stockPriceData.length - 1); i >= 0; i--) {
        if (stockPriceData[i].dayDate > lastDate) {
          //add midding price
          console.log(`===Missing date is ${stockPriceData[i].dayDate}`);
          //add price in db
          const dbResult = await db.addDailyPrice(stockPriceData[i], symbol);
          if (dbResult) {
            console.log('===Price Added');
          } else {
            console.log(`===Error Adding stock price`);
          }
        }
      }
    }
  } catch (error) {
    throw new Error(`===Error Adding stock price, Error: ${error}`);
  }
}

const updateStockPrice = async (symbol) => {
  try {
    //check the latest date in the db
    console.log('===Finding Latest Stock Price ...');
    const lastPrice = await db.findLatestStockPrice(symbol);
    if (!lastPrice) {
      await addStockPrice(symbol);
    } else {
      //getting yesterday date and day number (workingday or weekend)
      const yesterdayDate = getDate(1);
      const yesterdayDay = () => {
        const day = new Date(yesterdayDate);
        return day.getDay();
      }
      //check if price is uptodate
      if (lastPrice.dayDate < yesterdayDate && (yesterdayDay() !== 6 || yesterdayDay() !== 0)) {
        console.log('===There is a missing prices');
        //add missing date price
        await addMissingStockPrice(symbol, lastPrice.dayDate);
      } else {
        console.log(`===Stock Price is uptodate, latest price date is ${lastPrice.dayDate}`);
      }
    }

  } catch (error) {
    throw new Error(`===Error finding last stock price, Error: ${error}`);
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