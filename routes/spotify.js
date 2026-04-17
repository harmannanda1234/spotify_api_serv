const express = require('express')

const sprouter = express.Router();


sprouter.get('/getClientlogin',()=>{console.log("hi")});

module.exports= sprouter;