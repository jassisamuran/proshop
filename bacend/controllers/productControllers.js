import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

const getTopProduct =asyncHandler (async(re,res)=>{

    // console.log(re.body.id)

    const products=await Product.find({}).sort({rating:-1}).limit(3)
     res.json(products)
 })
 
const getProducts =asyncHandler (async(re,res)=>{

    const products=await Product.find({})
    // const products=await Product.find({}).sort({rating:-1}).limit(1)
    res.json(products)
})


const getProductsById =asyncHandler (async(re,res)=>{

    const product= await Product.findById(re.params.id)
    // res.send("Hello world!");
if(!product)res.send("<html> <head>server Response</head><body><h1> Nothing to see here</p></h1></body></html>");
// console.log(product) 
    res.json(product)
})

const deleteProduct =asyncHandler (async(re,res)=>{

    const product= await Product.findById(re.params.id)
   if(product){
    await product.remove();
    res.json({message:'product removed'});

   }else{
    res.status(404);
    throw new Error('product not found');
   }

})


const createProduct =asyncHandler (async(re,res)=>{
    const product=new Product({
        name:'sample',
        price:0,
        user:re.user._id,
        image:'image/sample.img',
        brand:'brand ',
        category:'category',
        countInStock:0,
        numReviews:0,
        description:'sample description',

    })
    const productsv=product.save();
    res.status(201).json(product);

})

const updateProduct =asyncHandler (async(re,res)=>{
   const {name,price,description,image,brand,category,countInStock}=re.body

    const product=await Product.findById(re.params.id)
    if(product){
        product.name=name
        product.price=price
        product.description=description
        product.image=image
        product.brand=brand
        product.category=category
        product.countInStock=countInStock
        const updatedProduct=await product.save()
        res.status(201).json(product);
    }else{
        res.status(404);
        throw new Error('product not found')
    }
})


const createProductReview =asyncHandler (async(re,res)=>{
    const {rating,comment}=re.body
     const product=await Product.findById(re.params.id)
     if(product){
        const alreadyReviewed=product.reviews.find(r=>r.user.toString()===re.user._id.toString())
        
        if(alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviewed')        
        }
        const review={
            name:re.user.name,
            rating:Number(rating),
            comment,
            user:re.user._id
        }
        product.reviews.push(review)
        product.numReviews=product.reviews.length;
        product.rating=product.reviews.reduce((acc,item)=>item.rating + acc, 0)/product.reviews.length
        
        await product.save()
        res.status(201).json({message:'Reviews added'})        
    }else{
         res.status(404);
         throw new Error('product not found')
     }
 })


//  const getTopProducts =asyncHandler (async(re,res)=>{

//     const products=await Product.find({})
//     res.json(products)
//     console.log('hi')
//    const product=await Product.find({}).sort({rating:-1}).limit(3)
//    console.log(product)
//    res.json(products);
//  })



export {getProducts,getProductsById,deleteProduct,updateProduct,createProduct,createProductReview,getTopProduct}