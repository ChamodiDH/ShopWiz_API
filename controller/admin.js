const Product = require('../model/Product')

exports.createProduct = (req,res,next) => {
    const name = req.body.name
    const imageUrl = 'images/e3.jpg'
    const description = req.body.description
    const price = req.body.price
    const creator = {name:'Chamodi'}

    const object = req.body.name
    console.log(object)

   const product = new Product(
    {
        name: name,
        imageUrl:imageUrl,
        description: description,
        price:+price,
        creator:creator
    }
   )

   product.save().then(
    result => {
        console.log('product added to the db successfully')
        res.status(201).json(
            {
                message:'Product created successfully',
                product:result
            }
        )
    }
   ).catch(err => {
    console.log(err)
   })

}

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

exports.postEditProduct = (req,res,next) => {
    const productId = req.body.productId
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const price = req.body.price

    console.log(req.body.productId)
    console.log(req.body.imageUrl)
    console.log(req.body.description)

    Product.findById(productId).then(
        product => {
            if(!product){
                res.status(404).json({
                    message:'No such product exists'
                })
            }

            product.imageUrl = imageUrl
            product.description = description
            product.price = price
            product.save()
            res.status(202).json({
                message:"product update successfully!",

            })
        }
    ).catch()
}

exports.deleteProduct = (req,res,next) => {
    const productId = req.body.productId
    Product.findById(productId).then(
        product => {
            if(!product){
                res.status(404).json({
                    message:'No such product exists'
                })
            }

            Product.findByIdAndRemove(product._id).then(
                result => {
                    res.status(404).json({
                        message:'Successfully deleted the product'
                    })
                }
            ).catch(err => console.log('cannot delete'+ err))
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