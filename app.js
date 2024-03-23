const express = require('express');
const app = express();
const smaRoutes = require('./routes/sma/smaRoutes');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use('/sma', smaRoutes);

// app.get('/', (req, res)=>{
//     res.render('home');
// })

module.exports = app;