var apiKey = require('../../config/alphaVantageKey.json');
const db = require('../../models/dbHelpers');

const findStock = async (symbol) => {
  try {
    const findStockResult = await db.findStockById(symbol);
    return (findStockResult);
  } catch (error) {
    throw new Error(`===Error finding Stock, Error: ${error}`);
  }
}

const addStock = async (symbol) => {
  try {
    const stockInfo = await getStockInfo(symbol);
    const addStockResult = await db.addStock(stockInfo);
    return (addStockResult);
  } catch (error) {
    throw new Error(`===Error adding new stock, Error: ${error}`);
  }
}

const getStockInfo = async (symbol) => {
  try {
    console.log("===Getting Stock Info ...");
    const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
    const data = await response.json();
    if (data) {
      const stockInfo = {
        symbol: symbol,
        name: data.Name,
        marketName: `${data.Country}:${data.Exchange}`,
        industryGroup: data.Sector,
        description: data.Description,
        logoUrl: `https://financialmodelingprep.com/image-stock/${symbol}.png`,
      };
      return stockInfo;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`===Error getting stock info, Error: ${error}`);
  }
}

const getStockPrice = async (symbol, outputsize) => {
  try {
    console.log("===Getting Stock Price ...");
    var price = [];
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${apiKey}`);
    const data = await response.json();
    if (data) {
      //success response
      //console.log(data);
      //parss JSON object
      Object.keys(data).forEach((key) => {
        if (key == 'Time Series (Daily)') {
          let dailyPrice = data[key];
          Object.keys(dailyPrice).forEach((key) => {
            price.push({
              symbol: symbol,
              dayDate: key,
              closePrice: parseFloat(dailyPrice[key]['4. close'])
            })
          });
        } else {
          if (key != "Meta Data") {
            console.log(`===Error response body,  Body: ${data}`);
            return false;
          }
        }
      });
      return price;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`===Error getting stock price, Error: ${error}`);
  }
}

const addStockPrice = async (symbol, outputsize) => {
  try {
    const stockPriceData = await getStockPrice(symbol, outputsize);
    if (stockPriceData.length > 0) {
      console.log("===Adding Stock Price ...")
      //console.log(stockPriceData)
      //add price into db
      for (let i = (stockPriceData.length - 1); i >= 0; i--) {
        const dbResult = await db.addDailyPrice(stockPriceData[i], symbol)
        // if (dbResult) {
        //   console.log('===Price Added')
        // } else {
        //   console.log(`===Error Adding stock price`);
        // }
      }
    }
  } catch (error) {
    throw new Error(`===Error Adding stock price, Error: ${error}`);
  }
}

const addMissingStockPrice = async (symbol, lastDate) => {
  try {
    const stockPriceData = await getStockPrice(symbol, 'compact');
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
    //getting yesterday date and day number (workingday or weekend)
    const yesterday = () => {
      let d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    };
    const yesterdayDate = yesterday().toISOString().split('T')[0];
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
  } catch (error) {
    throw new Error(`===Error finding last stock price, Error: ${error}`);
  }
}

const fetchStockPrice = async (symbol) => {
  try {
    let stockPriceArray = [];
    const stockPrice = await db.findStockPriceById(symbol);
    if (stockPrice) {
      console.log('===Fetching Date & Price of stock')
      stockPrice.forEach((price) => {
        stockPriceArray.push({ date: price.dayDate, price: price.closePrice })
      });
      // console.log(stockPriceArray)
      return stockPriceArray;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`===Error fetching stock price, Error: ${error}`);
  }
}

const smaService = async (symbol) => {
  try {
    //find stock in db
    console.log('===Finding Stock ...');
    const stock = await findStock(symbol);
    if (!stock) {
      //add stock if it is not exist
      console.log('===Stock DOES NOT Exist');
      await addStock(symbol);
      console.log('===Stock Added');
      await addStockPrice(symbol, 'full');
      console.log('===Stock Price Added');
    } else {
      //if the stock exist in db
      console.log('===Stock Exist');
      //console.log(stock);
      await updateStockPrice(symbol, 'compact');
    }
    console.log('===Fetching Stock Price ...');
    const stockPrice = await fetchStockPrice(symbol);
    return stockPrice;
  } catch (error) {
    throw new Error(`===Error smaService, Error: ${error}`);
  }
}
module.exports = smaService;