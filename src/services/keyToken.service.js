'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types} = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            //level xxx
            const filter = { user: userId }, updates = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken,
            }, options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, updates, options)
            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }

    }

    static findByUserId = async( userId ) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async(id) => {
        return await keytokenModel.deleteOne({ _id: id })
    }
    
    static findByRefreshTokenUsed = async( refreshToken) => {
        return await keytokenModel.findOne({refreshTokenUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async( refreshToken) => {
        return await keytokenModel.findOne({ refreshToken})
    }
    static deleteKeyById = async(userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }
}

module.exports = KeyTokenService