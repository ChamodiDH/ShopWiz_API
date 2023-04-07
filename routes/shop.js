const express = require('express')

const shopController = require('../controller/shop')
const router = express.Router()

router.get('/products', shopController.getProducts)
router.get('/product/:productId',  shopController.getProduct)
router.get('/filter-products',shopController.filterProducts)

module.exports = router;

