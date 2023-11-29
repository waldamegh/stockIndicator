const express = require('express');
const app = express();
const todoRoutes = require('./routes/sma/smaRoutes');

app.use(express.json());
app.use('/sma', todoRoutes);

module.exports = app;