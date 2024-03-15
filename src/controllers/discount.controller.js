'use strict'

const DiscountService = require('../services/discount.service')
const { SuccessResponse} = require('../core/success.response')

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful getAllDiscountAmount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodeWithProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful getAllDiscountCodeWithProducts',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()
