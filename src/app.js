require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')


const app = express() 

//init middlewares
app.use(morgan("dev"))
// app.use(morgan("combined"))
// morgan("common")
// morgan("short")
// morgan("tiny")

app.use(helmet())
app.use(compression())

//init db
require("./dbs/init.mongodb")
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

//init routes
app.get('/', (req, res, next) => {
    // const strCompress = 'Hello Factipjs'
    return res.status(200).json({
        message: 'Welcome Fantipjs!',
        // metadata: strCompress.repeat(100000)
    })
})
//handling error


module.exports = app