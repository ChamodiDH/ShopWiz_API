const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
   {
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    type:{
        type:String,
        required:true
    },
    
    cart:{
        items:[{
           productId:{
              type: Schema.Types.ObjectId,
              ref: 'Product',
              required: true
            },
           quantity: { type: Number, required: true }
        }
          ]

    }
   }

   
)

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };
  
module.exports = mongoose.model('User', userSchema);