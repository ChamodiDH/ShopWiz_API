const express = require('express')

const adminController = require('../controller/admin')
const router = express.Router()
const isAuth = require('../middleware/isAuth')

router.get('/products',isAuth ,adminController.getProducts)


router.post('/product',isAuth ,adminController.createProduct)

router.get('/product/:productId',isAuth , adminController.getProduct)

router.post('/product/:productId',isAuth , adminController.postEditProduct)

router.post('/delete-product',isAuth ,adminController.deleteProduct)

router.get('/filter-products',isAuth ,adminController.filterProducts)

module.exports = router;

