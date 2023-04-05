const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        creator:{
            type:Object,
            required:true
        }
    }
)

module.exports = mongoose.model('Product',productSchema)