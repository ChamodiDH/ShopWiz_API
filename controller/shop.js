
const Product = require('../model/Product')
const User = require('../model/User')
const Order = require('../model/Order')

exports.getProducts = (req, res, next) => {
    Product.find().then(
        products => {
            res.status(200).json({
                message: "products fetched successfully",
                products: products
            }
            )
        }
    ).catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId

    Product.findById(productId).then(
        product => {
            res.status(201).json({
                message: 'Product fetched successfully',
                product: product
            }

            )
        }
    ).catch(err => console.log(err))

}

exports.filterProducts = (req, res, next) => {
    const { name, maxPrice } = req.query
    Product.find().then(
        products => {
            if (name) {
                products = products.filter(product => product.name === name)
            }

            if (maxPrice) {
                products = products.filter(product => product.price <= maxPrice)
            }

            if (products.length === 0) {
                res.status(404).json(

                    {
                        message: "Sorry, we don't have what you are looking for",

                    }
                )
            } else {
                res.status(200).json(

                    {
                        message: 'Filtered',
                        products: products
                    }
                )
            }

        }
    ).catch(err => console.log(err))
}

exports.addTocart = (req, res, next) => {
    const userId = req.userId
    const productId = req.body.productId
    Product.findById(productId).then(
        product => {
            if (!product) {
                console.log('Product not found')
            }

            User.findById(userId).then(
                user => {
                    let pq = {
                        productId: product,
                        quantity: 1
                    }
                    user.cart.items.push(pq)
                    user.save()
                    res.status(200).json({
                        message: "Product added to the cart",
                        user: user
                    })
                }
            ).catch(err => console.log(err))
        }
    ).catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    const userId = req.userId;
    console.log(userId)


    User.findById(userId)
        .populate('cart.items.productId').exec().then(
            user => {
                const products = user.cart.items;
                res.status(200).json({
                    cartitems: products
                })
            }
        ).catch(err => console.log(err))

};

exports.removeCartProduct = (req, res, next) => {
    const userId = req.userId;
    console.log(userId)

    const productId = req.body.productId


    User.findById(userId).then(
        user => {
            const updatedItems = user.cart.items.filter(item => {
                return item.productId.toString() !== productId.toString()
            })
            user.cart.items = updatedItems;
            user.save();
            res.status(200).json({
                message: "Item removed from your cart",
                items: updatedItems
            })
        }
    ).catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    const userId = req.userId
    User.findById(userId).populate('cart.items.productId').exec().then(
        user => {
            const orderedItems = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc }
                }


            })

            const order = new Order(
                {
                    products: orderedItems,
                    user: {
                        email: user.email,
                        userId: req.userId
                    }
                }
            )

           return order.save()
           
        }
    ).then(result => {
        res.status(200).json({
            message:'Order placed',
            result:result
        }
        
        )
    }).then(
        result => {
            return User.findById(userId).then(user => {
                user.clearCart()
            }).catch(err => console.log(err))
        }
    ).catch(err=>console.log(err))
    
}

exports.getOrders = (req,res,next) =>{
    const userId = req.userId

    Order.find({'user.userId':userId }).then(
        orders => {
            res.status(200).json({
                message:'Here are your orders',
                orders
            })
        }
    ).catch(err => console.log(err))
}