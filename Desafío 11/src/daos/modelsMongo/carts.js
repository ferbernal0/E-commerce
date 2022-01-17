import mongoose from 'mongoose';
const collectionRef = 'carts';

const CartsSchema = {
    products: {
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'products' }
        ], 
        default: []
    },
};

export { collectionRef, CartsSchema };