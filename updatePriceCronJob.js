//15 20 * * 1-5 node /updatePriceCronJob.js

const db = require('./models/dbHelpers');
const { getDate, updateStockPrice } = require('./routes/stocks/stocksService');

const updatePriceCronJob = async (req, res) => {
    const todayDate = getDate(2);
    const allStocksNotUpdated = await db.getNotUpdatedStocks(todayDate);
    console.log(`Not updated stocks are (${allStocksNotUpdated.length}) stocks`);
    allStocksNotUpdated.forEach(async (stock ) =>{
        await updateStockPrice(stock.symbol);
        console.log(`===(job) Updateing Stock Prices ${stock.symbol}=> Done`);
    });
};

module.exports = updatePriceCronJob;