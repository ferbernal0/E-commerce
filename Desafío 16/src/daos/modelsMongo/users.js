const collectionRef = 'users';

const UsersSchema = {
    email: { 
        type: String, 
        required: true,
        unique:true},
    username: { 
        type: String,
        required: true,
        unique:true},
    name: {
        type: String, 
        required: true },
    lastName: { 
        type: String, 
        required: true },
    age: { 
        type: Number, 
        required: true },    
    avatar: { 
        type: String,
            },
    password:{
        type:String,
        required:true
    }
    
};

export { collectionRef, UsersSchema };