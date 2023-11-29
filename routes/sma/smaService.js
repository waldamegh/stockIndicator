var request = require('request');
var apiKey = require('../../config/alphaVantageKey.json');
var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=$`;
const smaService = ()=> {
    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {
          // data is successfully parsed as a JSON object:
          console.log(data);
        }
    });
}


module.exports = smaService;