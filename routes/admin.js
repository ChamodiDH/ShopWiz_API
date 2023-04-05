const express = require('express')

const adminController = require('../controller/admin')
const router = express.Router()

router.get('/products', adminController.getProducts)


router.post('/product',adminController.createProduct)

router.get('/product/:productId', adminController.getProduct)

router.post('/product/:productId', adminController.postEditProduct)

router.post('/delete-product',adminController.deleteProduct)

router.get('/filter-products',adminController.filterProducts)

module.exports = router;

