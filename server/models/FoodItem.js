import mongoose from 'mongoose';
const foodItemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please add a food title']
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    originalPrice: {type : Number}, 
    imageUrl:{
        type:String,
        default:'https://via.placeholder.com/150'
    },
    //geo Spacial data
    location:{
        type:{
            type:String,
            enum:['Point'], // as it is geo json
            required:true
        },
    coordinates:{
        type:[Number],
        required:true,
    },
    address:{
        type:String
    }
    },
    isClaimed:{
        type:Boolean,
        default:false
    },
    pickupCode: {
    type: String,
  },
  aiRecipe: {
    type: String,
  },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:7200 //2 hours
    }
},{
    timestamps:true
});
foodItemSchema.index({location:'2dsphere'});
export default mongoose.model('foodItem',foodItemSchema);