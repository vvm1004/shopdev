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
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//test pub, sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:001', 10)
//init db
require("./dbs/init.mongodb")
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

//init routes
app.use('/', require('./routes/shop'))
//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Sever Error'
    })
})
module.exports = app