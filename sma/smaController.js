const express = require('express');
const smaService = require('./smaService');
const smaCalc = (req, res) => {
    smaService();
    res.json({
        sucessful: true,
        data: req.body, 
    });
};

module.exports = smaCalc;