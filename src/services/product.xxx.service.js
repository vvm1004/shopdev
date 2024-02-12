'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require("../core/error.response")


//define Factory class to create product
class ProductFactory {
        /*
            type: 'Clothing',
            payload
        */

    static productRegistry = {} //key-class
    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass)  throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }
}
/*
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    procduct_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true}
*/

//define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description,
        product_price, procduct_quantity, product_type,
        product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.procduct_quantity = procduct_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    //create new product 
    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}
//Define sub-class for diferrent product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newProduct._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

//Define sub-class for diferrent product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

//Define sub-class for diferrent product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Futniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

//register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory