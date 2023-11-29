const smaValidator = (req, res, next) =>{
    if(!req.body.text){
        // throw Error('Text is required');
        res.json({
            successful: false,
            error: { text: ['Text is required']},
        });
    }
    
    next();
};

module.exports = smaValidator;