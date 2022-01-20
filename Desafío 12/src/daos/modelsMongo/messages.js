import mongoose from "mongoose";

const collectionRef = 'messagesChat';

const MessagesSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        autopopulate:true,
        required:true
    },
    message: { 
        type: String, 
        required: true }
};

export { collectionRef, MessagesSchema };