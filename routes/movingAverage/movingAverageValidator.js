const { getDate } = require('../stocks/stocksService');

//function validate numbers (positive integer and greater than 1)
const isValidNum = (num) => {
    return (Number.isInteger(Number(num))) && (Number(num) > 1);
}
//function validate date format (yyyy-mm-dd) and the validity of the date
const isValidDate = (dateString) => {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}
//function for validating  movingAverage request body
const movingAverageValidator = (req, res, next) => {
    //array for error messages
    let arrayMsg = [];
    //validate request body
    //symbol validation
    if (!req.body.symbol) {
        arrayMsg.push({ invalidField: 'symbol', errorMassage: 'symbol is required' });
    }
    //strategy validation
    if (!req.body.strategy) {
        arrayMsg.push({ invalidField: 'strategy', errorMassage: 'strategy is required' });
    }
    if (!(req.body.strategy === 'PriceCrossover' || req.body.strategy === 'DoubleMovingAverageCrossover' || req.body.strategy === 'TripleMovingAverageCrossover')) {
        arrayMsg.push({ invalidField: 'strategy', errorMassage: 'strategy must be PriceCrossover, DoubleMovingAverageCrossover, or TripleMovingAverageCrossover' });
    }
    //short validation
    if (!req.body.short) {
        arrayMsg.push({ invalidField: 'short', errorMassage: 'short is required' });
    }
    if (req.body.short) {
        //type validation
        if (!req.body.short.type) {
            arrayMsg.push({ invalidField: 'short.type', errorMassage: 'short.type is required' });
        }
        if (!(req.body.short.type === 'sma' || req.body.short.type === 'ema')) {
            arrayMsg.push({ invalidField: 'short.type', errorMassage: 'short.type must be sma or ema' });
        }
        //numDays validation
        if (!req.body.short.numDays) {
            arrayMsg.push({ invalidField: 'short.numDays', errorMassage: 'short.numDays is required' });
        }
        if (req.body.short.numDays) {
            if (!isValidNum(req.body.short.numDays)) {
                arrayMsg.push({ invalidField: 'short.numDays', errorMassage: 'short.numDays must be number and grater than 1' });
            }
        }
    }
    //mid validation
    if (req.body.mid) {
        //type validation
        if (!req.body.mid.type) {
            arrayMsg.push({ invalidField: 'mid.type', errorMassage: 'mid.type is required' });
        }
        if (!(req.body.mid.type === 'sma' || req.body.mid.type === 'ema')) {
            arrayMsg.push({ invalidField: 'mid.type', errorMassage: 'mid.type must be sma or ema' });
        }
        //numDays validation
        if (!req.body.mid.numDays) {
            arrayMsg.push({ invalidField: 'mid.numDays', errorMassage: 'mid.numDays is required' });
        }
        if (req.body.mid.numDays) {
            if (!isValidNum(req.body.mid.numDays)) {
                arrayMsg.push({ invalidField: 'mid.numDays', errorMassage: 'mid.numDays must be number and grater than 1' });
            }
        }
    }
    //long validation
    if (req.body.long) {
        //type validation
        if (!req.body.long.type) {
            arrayMsg.push({ invalidField: 'long.type', errorMassage: 'long.type is required' });
        }
        if (!(req.body.long.type === 'sma' || req.body.long.type === 'ema')) {
            arrayMsg.push({ invalidField: 'long.type', errorMassage: 'long.type must be sma or ema' });
        }
        //numDays validation
        if (!req.body.long.numDays) {
            arrayMsg.push({ invalidField: 'long.numDays', errorMassage: 'long.numDays is required' });
        }
        if (req.body.long.numDays) {
            if (!isValidNum(req.body.long.numDays)) {
                arrayMsg.push({ invalidField: 'long.numDays', errorMassage: 'long.numDays must be number and grater than 1' });
            }
        }
    }
    //stratogy x long validation
    if (req.body.strategy === 'DoubleMovingAverageCrossover' || req.body.strategy === 'TripleMovingAverageCrossover') {
        if (!req.body.long) {
            arrayMsg.push({ invalidField: 'long', errorMassage: 'long is required' });
        }
    }
    //stratogy x mid validation
    if (req.body.strategy === 'TripleMovingAverageCrossover') {
        if (!req.body.mid) {
            arrayMsg.push({ invalidField: 'mid', errorMassage: 'mid is required' });
        }
    }
    const todayDate = getDate(0);
    console.log(`today date is ${todayDate}`)
    //date validation
    if (req.body.fromDate) {
        if (!isValidDate(req.body.fromDate)) {
            arrayMsg.push({ invalidField: 'fromDate', errorMassage: 'fromDate is invalid date (date format is yyyy-mm-dd)' });
        }
        if (req.body.fromDate > todayDate) {
            arrayMsg.push({ invalidField: 'fromDate', errorMassage: 'fromDate is invalid date, must be a date before today\'s date' });
        }
        if (!req.body.toDate) {
            arrayMsg.push({ invalidField: 'toDate', errorMassage: 'toDate is required' });
        }
        //date valid format + from date < today date + from date < to date + from date >= oldest db record 
    }
    if (req.body.toDate) {
        if (!isValidDate(req.body.toDate)) {
            arrayMsg.push({ invalidField: 'toDate', errorMassage: 'toDate is invalid date (date format is yyyy-mm-dd)' });
        }
        if (req.body.toDate > todayDate) {
            arrayMsg.push({ invalidField: 'toDate', errorMassage: 'toDate is invalid date, must be a date before today\'s date' });
        }
        if (!req.body.fromDate) {
            arrayMsg.push({ invalidField: 'fromDate', errorMassage: 'fromDate is required' });
        }
        if (req.body.fromDate >= req.body.toDate) {
            arrayMsg.push({ invalidField: 'toDate', errorMassage: 'toDate is invalid date, toDate cannot be equle or less than fromDate' });
        }
    }
    //return 400 if there is an invalid field
    if (arrayMsg.length > 0) {
        res.status(400).send({
            error: 'invalid request',
            errorDetails: arrayMsg,
        });
        return;
    }
    //validation passed
    next();
};

module.exports = movingAverageValidator;