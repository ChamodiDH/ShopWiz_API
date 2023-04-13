const express = require('express')

const shopController = require('../controller/shop')
const isAuth = require('../middleware/isAuth')
const router = express.Router()

router.get('/products',isAuth , shopController.getProducts)
router.get('/cart',isAuth , shopController.getCart)
router.post('/cart/remove',isAuth ,shopController.removeCartProduct)
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/cart/orderp',shopController.postOrder)
router.get('/cart/order',isAuth ,shopController.getOrders)
router.get('/product/:productId',isAuth , shopController.getProduct)
router.post('/product',isAuth , shopController.addTocart)
router.get('/filter-products',isAuth ,shopController.filterProducts)

module.exports = router;

