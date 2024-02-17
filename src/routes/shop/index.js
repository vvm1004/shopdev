'use strict'

const express = require('express');
const { apiKey, permisson } = require('../../auth/checkAuth');
const router = express.Router();


//check apikey
router.use(apiKey)

//check permission
router.use(permisson('0000'))

router.use('/v1/api/product', require('../product'))
router.use('/v1/api', require('../access'))


module.exports = router