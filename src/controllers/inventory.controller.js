'use strict'

const InventoryService = require('../services/inventory.service')
const { SuccessResponse} = require('../core/success.response')

class InventoryController {
    addStockInventory = async(req, res, next) => {
        new SuccessResponse({
            message: 'addStockInventory Success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
      }
}

module.exports = new InventoryController()