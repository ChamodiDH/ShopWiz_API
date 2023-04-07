

const User = require('../model/User');
const jwt = require('jsonwebtoken');

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

exports.login = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser 

    User.findOne({email:email}).then(
        user => {
            if(!user){
                console.log("No such user found")
            }

            loadedUser = user

            if(loadedUser.password == password){
                const token = jwt.sign(
                    {
                      email: loadedUser.email,
                      userId: loadedUser._id.toString()
                    },
                    'somesupersecretsecret',
                    { expiresIn: '1h' }
                  );
                  res.status(200).json({ token: token, userId: loadedUser._id.toString(),
                    message:"user found and token passed" });
            }
        }
    ).catch(err => console.log(err))
}