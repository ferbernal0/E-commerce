const collectionRef = 'products';

const ProductsSchema = {
    title:{
        type:String,
        unique:true,
        required:true},
    description:{
        type:String,
        required:true},
    code:{
        type:String,
        required:true,
        default: 'A-01'},
    thumbnail:{
        type:String,
        required:true},
    price:{
        type:Number,
        required:true},
    stock:{
        type:Number,
        required:true,
        default: 1 }
};

export { collectionRef, ProductsSchema };