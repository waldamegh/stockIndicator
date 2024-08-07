const db = require('../../models/dbHelpers');
var config = require('../../config/fmpKey.json');
var fs = require('fs');
var https = require('https');

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
    const stockInfo = await checkStockInsertion(symbol);
    console.log('===Returning Stock Info to Controller');
    return stockInfo;
  } catch (error) {
    throw new Error(`===Error getting stock info from DB, Error: ${error}`);
  }
}

const checkStockInsertion = async (symbol) => {
  try {
    console.log('===Checking stock insertion into DB ....');
    var stockInfo = await db.findStockById(symbol);
    if (!stockInfo) {
      console.log('===Stock not found');
      stockInfo = await addStock(symbol);
    } else {
      console.log('===Stock found');
    }
    return stockInfo;
  } catch (error) {
    throw new Error(`===Error checking stock insertion into DB, Error: ${error}`);
  }
}

//Node.js Function to save image from External URL.
const saveImageToDisk = async (url, localPath) => {
  fs.open(localPath, 'r', (err, fd) => {
    if (err) {
      var file = fs.createWriteStream(localPath);
      https.get(url, function (response) {
        response.pipe(file);
      });
    }
  });

}

const getStockInfo = async (symbol) => {
  try {
    console.log("******Getting Stock Info From FMP ~~~~~~");
    const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${config.apiKey}`);
    const data = await response.json();
    //console.log(data)
    if (data) {
      const stockInfo = {
        symbol: symbol,
        name: data[0].companyName,
        marketName: `${data[0].country}:${data[0].exchangeShortName}`,
        sector: data[0].sector,
        industry: data[0].industry,
        description: data[0].description,
        currency: data[0].currency,
        website: data[0].website,
        logoUrl: data[0].image,
      };
      //save image to local files
      await saveImageToDisk(data[0].image, `./public/images/stockLogo/${symbol}.png`);
      return stockInfo;
    } else {
      throw new Error(`===Error getting stock info, Error: ${error}`);
    }
  } catch (error) {
    throw new Error(`===Error getting stock info, Error: ${error}`);
  }
}

const addStock = async (symbol) => {
  try {
    const stockInfo = await getStockInfo(symbol);
    const addStockResult = await db.addStock(stockInfo);
    await db.addStockStatus({ symbol: symbol, fromDate: '2024-06-18', toDate: '2024-06-18', statusId: '1' });
    return (addStockResult);
  } catch (error) {
    throw new Error(`===Error adding new stock, Error: ${error}`);
  }
}

const getStockPrice = async (symbol) => {
  try {
    console.log("******Getting Stock Price From FMP ~~~~~~");
    var price = [];
    const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${config.apiKey}`);
    const data = await response.json();
    if (data.historical) {
      //success response
      //console.log(data.historical);
      //parss JSON object
      data.historical.forEach((dailyData) => {
        if (dailyData.date >= getDate(730, false)) {
          price.push({
            symbol: symbol,
            dayDate: dailyData.date,
            closePrice: (parseFloat(dailyData.adjClose)).toFixed(2),
            change: parseFloat(dailyData.change),
            changePercent: parseFloat(dailyData.changePercent),
          });
        }
      });
      return price;
    } else {
      throw new Error(`===Error getting stock price, Error: ${error}`);
    }
  } catch (error) {
    throw new Error(`===Error getting stock price, Error: ${error}`);
  }
}

const addStockPrice = async (symbol) => {
  try {
    const stockPriceData = await getStockPrice(symbol);
    if (stockPriceData.length > 0) {
      console.log("===Adding Stock Price ...")
      //console.log(stockPriceData)
      //add price into db
      for (let i = (stockPriceData.length - 1); i >= 0; i--) {
        const dbResult = await db.addDailyPrice(stockPriceData[i], symbol);
        // if (dbResult) {
        //   console.log('===Price Added')
        // } else {
        //   console.log(`===Error Adding stock price`);
        // }
      }
      await db.updateStockStatus(symbol, { symbol: symbol, fromDate: stockPriceData[stockPriceData.length - 1].dayDate, toDate: stockPriceData[0].dayDate, statusId: '3' });
    }
  } catch (error) {
    throw new Error(`===Error Adding stock price, Error: ${error}`);
  }
}

const addMissingStockPrice = async (symbol, lastDate) => {
  try {
    const stockStatus = await db.findStockStatus(symbol);
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
      await db.updateStockStatus(symbol, { symbol: symbol, fromDate: stockStatus.fromDate, toDate: stockPriceData[0].dayDate, statusId: '3' });
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
      const todayDate = getDate(2, true);
      const todayDateFun = () => {
        const day = new Date(todayDate);
        return day.getDay();
      }
      //check if price is uptodate
      if (lastPrice.dayDate < todayDate && (todayDateFun() !== 6 || todayDateFun() !== 0)) {
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

const precheckFetchStockPriceService = async (symbol, fromDate, toDate) => {
  try {
    await checkStockInsertion(symbol);
    const stockStatus = await db.findStockStatus(symbol);
    if (stockStatus.statusId === 3 && stockStatus.fromDate <= fromDate && stockStatus.toDate >= toDate) {
      return true;
    } else {
      await updateStockPrice(symbol);
    }
  } catch (error) {
    throw new Error(`===Error precheck fetch stock price, Error: ${error}`);
  }

}

const fetchStockPriceService = async (symbol, fromDate, toDate) => {
  try {
    let stockPriceArray = [];
    await precheckFetchStockPriceService(symbol, fromDate, toDate);
    var stockPrice = await db.findStockPriceByIdFromToDate(symbol, fromDate, toDate);
    console.log('===Fetching Date & Price of stock');
    //console.log(JSON.stringify(stockPrice))
    stockPrice.forEach((price) => {
      stockPriceArray.push({ date: price.dayDate, price: price.closePrice, change: price.change, changePercent: price.changePercent });
    });
    console.log(`stock fitched price [${symbol}] = ${JSON.stringify(stockPriceArray)}`)
    return stockPriceArray;
  } catch (error) {
    throw new Error(`===Error fetching stock price, Error: ${error}`);
  }
}

const getDate = (num, marketTime) => {
  let dateValue = new Date();
  dateValue.setDate(dateValue.getDate() - num);
  const todayDate = new Date();
  if (marketTime) {
    if (dateValue.getDate() === todayDate.getDate() && dateValue.toISOString().split('T')[1] <= '16:15:00.000Z') {
      dateValue.setDate(dateValue.getDate() - 1);
    }
  }
  return dateValue.toISOString().split('T')[0];
}

const getDateDifferenceInDays = (date1, date2) => {
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / (1000 * 3600 * 24)));
}

module.exports = { getAllStocksService, getStockInfoService, fetchStockPriceService, getDate, getDateDifferenceInDays, getStockPrice, addStockPrice, addStock, checkStockInsertion, updateStockPrice };