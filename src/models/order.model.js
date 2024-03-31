'use stric'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema(
    {
        oder_userId: {type: Number, required: true},
        oder_checkout: {type: Object, default: {}},
        /*
            order_checkout = {
                totalPrice,
                totalApllyDiscount,
                feeShip
            }
        */
       order_shipping: {type: Object, default: {}},
       /*
            street,
            city,
            state,
            country
       */
      order_payment: {type: Object, default: {}},
      order_product: {type: Array, required: true},
      order_trackingNumber: {type: String, default: '#0000118052022'},
      order_status: {type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delevered'], default: 'pending'},
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'modifiedOn'
        }
    }
);

module.exports = { 
    order: model(DOCUMENT_NAME, orderSchema) 
};

