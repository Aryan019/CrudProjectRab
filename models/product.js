

// Connecting to the DB
const mongoose = require('mongoose');




const productSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    price:{
        type: Number,
        required : true
    },
    image:{
        type : String, 
        default : 'https://static.vecteezy.com/system/resources/previews/028/047/017/non_2x/3d-check-product-free-png.png'
    },
    featured:{
        type: Boolean,
        default : false
    },
    rating:{
        type : Number,
        default : 3

    },
    date:{
        type : Date,
        default : Date.now,
        required : true,
    },
    company:{
        type : String,
        required : true
    }
})


const Product = mongoose.model('Product',productSchema)
module.exports = Product;