'use stric'

const {model, Schema, Types} = require('mongoose');

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME= 'Apikeys'

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    
    status: {
      type: Boolean,
      default: true
    },
    permissons: {
        type: [String],
        required :true, 
        enum: ['0000', '1111', '2222']
    },
   
  },
  { 
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports =  model(DOCUMENT_NAME, apiKeySchema);

