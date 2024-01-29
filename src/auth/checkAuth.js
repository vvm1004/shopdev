'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const { findById } = require('../services/apikey.service')

const apiKey = async(req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}
const permisson = ( permission ) => {
    return (req, res, next) => {
        if(!req.objKey.permissons){
            return res.status(403).json({
                message: 'permission denied'
            })

        }
        console.log('permisssions::', req.objKey.permissons)
        const validPermission = req.objKey.permissons.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        return next()
    }
}


module.exports = {
    apiKey,
    permisson,
}