
const Product = require('../model/Product')
const User = require('../model/User')
const Order = require('../model/Order')
const stripe = require('stripe')('sk_test_51MwIOaHbUCWkFhTGDGfTvEn7bpUZfSAYKpkOe98GjzVbamkwYZd5GoRL4IB0OFF0ab3su0qbJbDpWFYK84LCoyCC00Z1EUL4cj');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const ITEMS_PER_PAGE = 2;

// const transporter = nodemailer.createTransport(
//     sendgridTransport({
//         auth: {
//             api_key:
//                
//         }
//     })
// );

//skip pages and limit the items per page
const skipPages = (arr,page) => {
    const number = ((page-1) * ITEMS_PER_PAGE) -1
    console.log(number)
    const newarr = arr.filter( a => { return arr.indexOf(a) > number} )
    const unarr = []
    console.log(newarr)
    unarr.push(...newarr.slice(0,2))
    console.log(unarr)
    return unarr

    
}

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1
    let totalItems


    Product.find().countDocuments().then(
        numofProducts => {
            totalItems = numofProducts
            return Product.find().skip((page -1 ) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        }
    ).then(
        products => {
            res.status(200).json({
                message: "products fetched successfully",
                products: products,
                currentPage:page,
                hasNextPage:ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage:page>1,
                nextPage:page+1,
                previousPage:page-1,
                lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
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
    Product.find().countDocuments().then(
        numofProducts => {
            totalItems = numofProducts
            return Product.find().skip((page -1 ) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        }
    ).then(
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
                        products: products,
                        currentPage:page,
                        hasNextPage:ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage:page>1,
                        nextPage:page+1,
                        previousPage:page-1,
                        lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
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
    const page = +req.query.page || 1
    console.log(userId)


    User.findById(userId)
        .populate('cart.items.productId').exec().then(
            user => {
                const products = user.cart.items;
                console.log(products)
                const count = products.length
                const totalItems = count
                const sortedProducts = skipPages(products,page)
                res.status(200).json({
                    cartitems:sortedProducts,
                    count:count,
                    currentPage:page,
                    hasNextPage:ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage:page>1,
                    nextPage:page+1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
                   
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

exports.getCheckout = (req, res, next) => {
    let products
    let total = 0
    const userId = req.userId

    User.findById(userId).populate('cart.items.productId').exec().then(
        user => {

            products = user.cart.items
            total = 0
            products.forEach(
                p => {
                    total += p.quantity * p.price
                }
            )

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: products.map(p => {
                    return {
                        price_data: {
                            currency: 'usd',
                            //mode: 'payment',
                            product_data: {
                                name: p.productId.name,
                                description: p.productId.description,
                            },
                            unit_amount: p.productId.price * 100,
                        },
                        quantity: p.quantity
                        // mode: 'payment'
                    }
                }),
                success_url: req.protocol + '://' + req.get('host') + '/shop/cart/orderp?userId=' + userId, // => http://localhost:3000
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            })


        }).then(session => {
            res.status(200).json(
                {
                    message: "Stripe session intialized",
                    sessionId: session.id,
                    sessionURL: session.url
                }
            )
        }

        ).catch(err => console.log(err))






}

exports.postOrder = (req, res, next) => {
    const userId = req.query.userId
    let orderedItems
    User.findById(userId).populate('cart.items.productId').exec().then(
        user => {
            orderedItems = user.cart.items.map(i => {
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
                        userId: req.query.userId
                    }
                }
            )

            return order.save()

        }
    ).then(result => {
        res.status(200).json({
            message: 'Order placed',
            result: result
        }

        )
//         return transporter.sendMail({
//             to: 'binky@mailinator.com',
//            from: 'chamodi3797@gmail.com',
//             subject: 'Your Order Placed Successfully',
//             html: `
//     <h1>You have placed the order successfully</h1>
//     <p>Here are the details of your order:</p>
//     <ul>
//       ${orderedItems.map(item => `<li>${item.product.name} (${item.quantity}) - $${item.product.price}</li>`).join('')}
//     </ul>
//   `
//         })
    }).then(
        result => {
            return User.findById(userId).then(user => {
                user.clearCart()
            }).catch(err => console.log(err))
        }
    ).catch(err => console.log(err))

}

exports.getOrders = (req, res, next) => {
    const userId = req.userId
    const page = +req.query.page || 1

    Order.find({ 'user.userId': userId }).countDocuments().then(
        numofOrders => {
            totalItems =  numofOrders
            return Order.find({ 'user.userId': userId }).skip((page -1 ) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        }
    ).then(
        orders => {
            res.status(200).json({
                message: 'Here are your orders',
                totalOrders:totalItems,
                orders:orders,
                hasNextPage:ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage:page>1,
                nextPage:page+1,
                previousPage:page-1,
                lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
            
            })
        }
    ).catch(err => console.log(err))
}