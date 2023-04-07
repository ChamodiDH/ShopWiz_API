const jwt = require('jsonwebtoken');

const User = require('../model/User');

exports.signUp = (req,res,next) =>{
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const type = req.body.type

    const user = new User({
        email: email,
        password:password,
        name:name,
        type:type
    })

    user.save().then(
        user => {
            res.status(200).json({
                message:'User is successfully registered',
                user:user
            })
        }
    ).catch(err => {
        console.log('Failed to register the user')
        console.log(err)
    })
}