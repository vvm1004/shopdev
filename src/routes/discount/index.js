'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

//get amount a discount
router.post('/amount', asyncHandler (discountController.getAllDiscountAmount))
router.get('/list_product_code', asyncHandler (discountController.getAllDiscountCodeWithProducts))

//authentication
router.use(authenticationV2)

router.post('', asyncHandler (discountController.createDiscountCode))
router.get('', asyncHandler (discountController.getAllDiscountCodes))


module.exports = router