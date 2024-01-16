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
    refreshToken: {
        type: Array,
        required: []
    },

  },
  { 
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports =  model(DOCUMENT_NAME, keyTokenSchema);

