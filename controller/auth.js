

const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');


// const transporter = nodemailer.createTransport(
//     sendgridTransport({
//       auth: {
//         api_key:
//          
//       }
//     })
//   );

exports.signUp = (req,res,next) =>{
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const type = req.body.type

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            oldInput: {
              email: email,
              password: password,
              confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }

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

            // return transporter.sendMail({
            //     to: email,
            //     from: 'chamodi3797@gmail.com',
            //     subject: 'Signup succeeded!',
            //     html: '<h1>You successfully signed up!</h1>'
            //   })
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
    const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({
        errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    })
  }

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
                    { expiresIn: '3h' }
                  );
                  res.status(200).json({ token: token, userId: loadedUser._id.toString(),
                    message:"user found and token passed" });
            }
        }
    ).catch(err => console.log(err))
}