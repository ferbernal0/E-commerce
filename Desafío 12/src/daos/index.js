let products;
let carts;
let chats;
let users;
let messages;
let persistence = 'mongo';

switch(persistence){
    case "fileSystem":
        const{default:ProductsFileSystem} = await import ('./products/productsFileSystem.js');
        const{default:CartsFileSystem} = await import ('./carts/cartsFileSystem.js');
        products = new ProductsFileSystem();
        carts = new CartsFileSystem();        
        break;
    case "mongo":
        const{default:ProductsMongo} = await import ('./products/productsMongo.js');
        const{default:CartsMongo} = await import ('./carts/cartsMongo.js');        
        const{default:ChatsMongo} = await import ('./chats/chatsMongo.js')
        const{default:UsersMongo} = await import ('./users/usersMongo.js')
        const{default:MessagesMongo} = await import ('./messages/messagesMongo.js')
        products = new ProductsMongo();
        carts = new CartsMongo();         
        chats = new ChatsMongo();
        users = new UsersMongo();
        messages = new MessagesMongo();
        break;
    case "fb":
        const{default:ProductsFb} = await import ('./products/productsFb.js');
        const{default:CartsFb} = await import ('./carts/cartsFb.js');
        products = new ProductsFb();
        carts = new CartsFb(); 
        break;
    default:

}export {products,carts,chats,users,messages,persistence}