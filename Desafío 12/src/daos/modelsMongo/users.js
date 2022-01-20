const collectionRef = 'users';

const UsersSchema = {
    email: { 
        type: String, 
        required: true},
    username: { 
        type: String,
        required: true },
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
        default:'http://alexeitruhin.github.io/images/avatar-br.png'},
    password:{
        type:String,
        required:true
    }
    
};

export { collectionRef, UsersSchema };