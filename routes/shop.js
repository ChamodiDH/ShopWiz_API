const express = require('express')

const shopController = require('../controller/shop')
const isAuth = require('../middleware/isAuth')
const router = express.Router()

router.get('/products',isAuth , shopController.getProducts)
router.get('/product/:productId',isAuth , shopController.getProduct)
router.post('/product',isAuth , shopController.addTocart)
router.get('/filter-products',isAuth ,shopController.filterProducts)

module.exports = router;

