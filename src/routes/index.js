'use strict'

const express = require('express')
const router = express.Router();

router.use('/v1/api', require('./access'))
// router.get('', (req, res, next) => {
//     // const strCompress = 'Hello Factipjs'
//     return res.status(200).json({
//         message: 'Welcome Fantipjs!',
//         // metadata: strCompress.repeat(100000)
//     })
// })

module.exports = router