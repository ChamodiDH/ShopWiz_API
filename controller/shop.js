
const Product = require('../model/Product')

exports.getProducts = (req,res,next) => {
    Product.find().then(
        products => {
            res.status(200).json({
                message:"products fetched successfully",
                products:products
            }
            )
        }
    ).catch(err => console.log(err))
}

exports.getProduct = (req,res,next) => {
   const productId = req.params.productId

   Product.findById(productId).then(
    product => {
        res.status(201).json({
            message:'Product fetched successfully',
            product:product
        }
           
        )
    }
   ).catch(err => console.log(err))

}

exports.filterProducts = (req,res,next) => {
    const {name,maxPrice} = req.query
     Product.find().then(
        products => {
            if(name){
                products = products.filter(product => product.name === name)
            }

            if(maxPrice){
                products = products.filter(product => product.price <= maxPrice)
            }

            if(products.length === 0){
                res.status(404).json(

                    {
                        message: "Sorry, we don't have what you are looking for",
                        
                    }
                )
            }else{
                res.status(200).json(

                    {
                        message: 'Filtered',
                        products:products
                    }
                )
            }
           
        }
     ).catch(err => console.log(err))
}