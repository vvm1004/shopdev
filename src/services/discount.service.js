/*
    Discount Services
    1- Generator Discount Code [Shop | Admin]
    2- Get discount amount [User]
    3- Get all discount codes [User | Shop]
    4- Verify discount code [user]
    5- Delete discount Code [Admin | Shop]
    6- Cancel discount code [user]
*/
const { BadRequestError, NotFoundError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { findAllDiscountCodeUnSelect, findAllDiscountCodesSelect, checkDiscountExists } = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
        } = payload
        //kiem tra
        // if (new Date() < new Data(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expried!')
        // }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }

        //create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exist!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,

            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }
    static async updateDiscountCode() {
        //..
    }

    /*
        Get list product by discount_code
    */
    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        //create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount && !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount not exist!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            //get the products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    /*
        Get list discount_code by shopId
    */

    static async getAllDiscountByShop({
        shopId, limit, page
    }) {
        const discounts = await findAllDiscountCodesSelect({
            //findAllDiscountCodeUnSelect
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_code', 'discount_name'],
            //unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }


    /*
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError(`discount doesn't exitst`)

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date

        } = foundDiscount

        if (!discount_is_active) throw new (`discount expried`)
        if (!discount_max_uses) throw new NotFoundError(`discount are out`)

        // if (new Date() < new Data(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new NotFoundError('Discount code has expried!')
        // }

        //check xem co set gia tri toi thieu hay khong ?
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                // throw new NotFoundError(`Discount requires a minium order values of ${discount_min_order_value}!`)
            }
        }
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUserDiscount) {
                //...
            }
        }
        //check xem discount nay la fixed amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    /*
        Cancel Discount Code ()
    */
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError(`discount doesn't exitst`)

        const result = await discount.findByIdAndDelete(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }   
        })

        return result

    }
}

module.exports = DiscountService