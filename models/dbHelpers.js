// knex queries
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

module.exports = {
    addStock,
    findStockById,
    findStockPriceById,
    addDailyPrice,
    findLatestStockPrice
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
        .where({ symbol : id});
}

async function addDailyPrice(dailyPrice, symbol) {
    const [id] = await db('dailyPrice')
        .where({ symbol })
        .insert(dailyPrice);
    return findStockPriceById(symbol);
}

async function findLatestStockPrice(id) {
    return db('dailyPrice')
        .where({ symbol : id})
        .orderBy('dayDate', 'desc')
        .first();
}