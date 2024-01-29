'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair } = require("../auth/authUtils")
const { getIntoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")

//service //
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static logout = async ( keyStore ) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(delKey)
        return delKey
    }
    static login = async ({ email, password, refreshToken = null }) => {
        //1.check email in dbs
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registered')

        //2.match password
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError("Authentication error")

        //3.create AT vs RT and save
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4. generate tokens
        const {_id: userId} = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })

        //5. get data and return 

        return {
            shop: getIntoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }

    }
    static signUp = async ({ name, email, password }) => {
        // try {
        //step1: check email exist
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registed!')

        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            //created privateKey, publicKey
            // const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1', //pkcs8 //Public key CryptoGraphy Standards
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')



            console.log({ privateKey, publicKey }) //save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                //throw new BadRequest('Error: Shop already registed!')

                return {
                    code: 'xxxx',
                    message: 'keyStore error'
                }

            }
            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Created Token Success::`, tokens)

            return {
                shop: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }
        }
        return {
            code: '200',
            metadata: null
        }
        // } catch (error) {
        //     console.error(error)
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService