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
    findOldestStockPrice
}

async function getAllStocks() {
    return db('stocks');
}

async function addStock(stock) {
    const [id] = await db('stocks').insert(stock);
    return id;
}

async function findStockById(id) {
    return db('stocks')
        .where({ symbol: id })
        .first();
}

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