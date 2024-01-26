'use stric'

const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME= 'Keys'

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array,
        default: []   //nhung RT da duoc su dung
    },
    refreshToken: {type: String, required: true}

  },
  { 
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports =  model(DOCUMENT_NAME, keyTokenSchema);

