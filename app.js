const express = require('express');
const path = require('path');
const app = express();
const stocksRoutes = require('./routes/stocks/stocksRoutes');
const smaRoutes = require('./routes/movingAverage/movingAverageRoutes');

app.use(express.json());
app.use(express.static('public'));

app.use('/stocks/movingAverage', smaRoutes);
app.use('/stocks', stocksRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/homepage.html'))
});
app.get('/stocks', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/stocks.html'))
});
app.get('/stocks/stockProfile', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/stockProfile.html'))
});
app.get('/markets', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/markets.html'))
});

module.exports = app;