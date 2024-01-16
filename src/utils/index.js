'use strict'

const _ = require('lodash')

const getIntoData = ({ fields = [], object = {}}) => {
    return _.pick(object, fields)
}

module.exports = {
    getIntoData
}