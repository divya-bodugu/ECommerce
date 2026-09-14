import mongoose from 'mongoose';
const productSchema=new mongoose.Schema({
    name: { type:String, required:true, trim:true },
    description: { type:String, required:true },
    price:{type:Number, required:true},
    category:{type:String, required:true},
    stock:{type:Number, required:true},
    published:{type:Boolean, required:true}
},
{
    timestamps:true
}
);
const products=mongoose.model('Product', productSchema);
export default products;