// Setting the express server up 
const express = require('express');
const app  = express();
const path = require('path')
const methodOverride = require('method-override')


// Establishing connection with mongoose
const mongoose = require('mongoose');
const Product = require('./models/product.js');


mongoose.connect('mongodb://127.0.0.1:27017/rabloAssignDB')
.then(()=>{
    console.log("Connection open for mongoose")
})

.catch(err =>{
    console.log("Oh no mongo threw an error")
    console.log(err)

})


// Middlewares here please 
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

// Routing Starting from here 
app.get('/allProducts',async(req,res)=>{
    const allProducts = await Product.find({})
    // console.log(allProducts)

    res.render('index',{allProducts})

})

// Route for adding in new products
app.get('/products/new',(req,res)=>{

    res.render('newProduct')
})


let featuredData;

// Route where the form submits to 
app.post('/productsNew',async(req,res)=>{
    // Making the checkbox input from on to true 

    const checkFeatured = req.body.featured;
    if(req.body.image ==''){
        req.body.image = 'https://static.vecteezy.com/system/resources/previews/028/047/017/non_2x/3d-check-product-free-png.png'
    }
    // console.log(checkFeatured)

    if(checkFeatured == 'on'){
        req.body.featured = true
    }
    
    else{
        req.body.featured = false;
    }

    console.log(req.body)

    // Making in the new product 
    const newProduct = new Product(req.body);
    await newProduct.save();

    
    res.redirect('/allProducts')
})

// Updating a product 
app.get('/products/:id/edit',async(req,res)=>{

    // Fetching the unique product id 
    const {id} = req.params;

    // finding the product to update 
    const product = await Product.findById(id)
    res.render('edit',{product})

})

app.put('/products/:id',async(req,res)=>{
    console.log(req.body)

    const checkFeatured = req.body.featured;
    // console.log(checkFeatured)

    if(checkFeatured == 'on'){
        req.body.featured = true
    }
    
    else{
        req.body.featured = false;
    }

    // changing the inner database
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
    
    console.log(product)
    res.redirect('/allProducts')
})

// Setting up the delete route 
app.delete('/products/:id',async(req,res)=>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id)

    res.redirect('/allProducts')

})

// route to get the featured products
app.get('/featuredProducts',async(req,res)=>{
    const msg = "Displaying all the featured items"
    featuredData = await Product.find({ featured: true });
    res.render('featuredProducts',{featuredData,msg})
})

// Sorting by price route (all products)
app.get('/products/:sort',async(req,res)=>{

    let productSort;

    const {sort} = req.params;
    console.log(sort);
   
    if(sort==='over'){
    const msg = "Displaying all products over 1000"
    productSort = await Product.find({ price: { $gte: 1000 } });
    res.render('sortByCost',{productSort,msg})
    }

    else if(sort==='under'){
        const msg = "Displaying all products under 1000"
        productSort = await Product.find({ price: { $lt: 1000 } });
        res.render('sortByCost',{productSort,msg});

    }

    else if(sort==='underfeatured'){
        const msg = "Displaying all featured items under 1000"
        featuredData = await Product.find({ 
            $and: [
                { price: { $lt: 1000 } },
                { featured: true }
            ]
        });

        res.render('featuredProducts',{featuredData,msg});
        
        
    }

    else{
        const msg = "Displaying all featured items over 1000"
        featuredData = await Product.find({ 
            $and: [
                { price: { $gte: 1000 } },
                { featured: true }
            ]
        });

        res.render('featuredProducts',{featuredData,msg});
        

    }

})




app.listen(3000,()=>{
    console.log("App is listening on port 3000")
})