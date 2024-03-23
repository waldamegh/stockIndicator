const smaValidator = (req, res, next) => {
    //array for error messages
    let arrayMsg = [];
    //validate request body
    //symbol validation
    if (!req.body.symbol) {
        arrayMsg.push({ invalidField: 'symbol', errorMassage: 'symbol is required' });
    }
    //numDays validation
    if (!req.body.numDays) {
        arrayMsg.push({ invalidField: 'numDays', errorMassage: 'numDays is required' });
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

module.exports = smaValidator;