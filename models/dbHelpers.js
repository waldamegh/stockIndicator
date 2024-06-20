// knex queries
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

module.exports = {
    getAllStocks,
    addStock,
    findStockById,
    findStockPriceById,
    findStockPriceByIdFromToDate,
    addDailyPrice,
    findLatestStockPrice,
    findOldestStockPrice,
    getNotUpdatedStocks,
    findStockStatus,
    addStockStatus,
    updateStockStatus
}

//Helpers: Table [stocks]
async function getAllStocks() {
    return db('stocks');
}

async function addStock(stock) {
    await db('stocks').insert(stock);
    return findStockById(stock.symbol);
}

async function findStockById(id) {
    return db('stocks')
        .where({ symbol: id })
        .first();
}

//Helpers: Table [dailyPrice]
async function findStockPriceById(id) {
    return db('dailyPrice')
        .where({ symbol: id });
}

async function findStockPriceByIdFromToDate(id, fromDate, toDate) {
    return db('dailyPrice')
        .where({ symbol: id })
        .whereBetween('dayDate', [fromDate, toDate]);
}

async function addDailyPrice(dailyPrice, symbol) {
    const [id] = await db('dailyPrice')
        .where({ symbol })
        .insert(dailyPrice);
    return findStockPriceById(symbol);
}

async function findLatestStockPrice(id) {
    return db('dailyPrice')
        .where({ symbol: id })
        .orderBy('dayDate', 'desc')
        .first();
}

async function findOldestStockPrice(id) {
    return db('dailyPrice')
        .where({ symbol: id })
        .orderBy('dayDate', 'asc')
        .first();
}

//Helpers: Table [stockStatus]
async function findStockStatus(symbol) {
    return db('stockStatus')
        .where({ symbol: symbol })
        .first();
}

async function addStockStatus(stockUpdate) {
    return db('stockStatus').insert(stockUpdate);
}

async function updateStockStatus(symbol, stockUpdate) {
    return db('stockStatus')
        .where({ symbol: symbol })
        .update(stockUpdate);
}

async function getNotUpdatedStocks(toDate) {
    return db('stockStatus')
        .whereNot({ statusId: 3 })
        .orWhere('toDate', '<', toDate );
}