const express = require('express');
const app = express();
const stocksRoutes = require('./routes/stocks/stocksRoutes');
const smaRoutes = require('./routes/movingAverage/movingAverageRoutes');

app.use(express.json());
app.use(express.static('public'));

app.use('/stocks/movingAverage', smaRoutes);
app.use('/stocks', stocksRoutes);

module.exports = app;