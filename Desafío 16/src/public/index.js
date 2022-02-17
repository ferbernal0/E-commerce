const socket = io();

let button = document.getElementById('button');
let idModify = null
let botonScroll= $(".boton-scroll");
let chatBox = document.getElementById('chatBox');
let message = document.getElementById('message');
let email = document.getElementById('email');
let nameUser = document.getElementById('user_firstName');
let lastName = document.getElementById('user_lastName');
let alias = document.getElementById('user_alias');
let age = document.getElementById('user_age');
let avatar = document.getElementById('user_avatar')
let compressionResult
let chatBoxGeneral = document.getElementById('chatBoxGeneral')
let logSection = document.getElementById('logSection')
let loggedBox = document.getElementById('loggedBox')
let userLogged = document.getElementById('userLogged')
let pictureProfile = document.getElementById('pictureProfile')
$("#chatBoxGeneral").slideUp(1); 
$("#loggedBox").slideUp(1); 
let user;

let btn = document.getElementById('facebook-login')
btn.addEventListener('click',(evt)=>{
    location = "http://localhost:8080/auth/facebook"
})

fetch('/checkSession').then(result=>result.json()).then(json=>{    
    user = json;    
    if (user){
        email.value = user.email,
        nameUser.value =user.name,
        lastName.value= user.lastName,
        alias.value= user.username,
        age.value = user.age,
        avatar.value=user.avatar
        userLogged.innerHTML = ` ${user.name} ${user.lastName}`
        pictureProfile.innerHTML = `<img src="${user.avatar}" class="border border-primary rounded-circle"/>`
        $("#chatBoxGeneral").slideDown(1); 
        $("#loggedBox").slideDown(1); 
        $("#logSection").slideUp(1)
    }
}).catch(err=>console.log('Aun no hay usuario logueado'))

function desloguear(){      
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Hasta luego ${user.name}`,
        showConfirmButton: false,
        timer: 2500
    }).then(res=>{
        fetch('/logout').then(result=>console.log(result)).then(res=>{
            // location.href='./pages/login.html'
            location.replace('./pages/login.html')
        })
    })         
}
//actualizacion de productos usando template handlebars
socket.on('updateProducts',products=>{
    let {data} = products;  
    fetch('templates/productsTable.handlebars')
        .then(string=>string.text())
        .then(template=>{
            const productsTemplate = Handlebars.compile(template);
            const productsObject = {
                products:data
            }       
            const html = productsTemplate(productsObject);
            let div = document.getElementById('productsTable');
            div.innerHTML=html;
        })  
})

//si el usuario esta logueado como administrador se habilita el MODO ADMINISTRADOR
socket.on('auth',res=>{
    let authentication = res;
    if (res){
        fetch('templates/auth.handlebars')
            .then(string=>string.text())
            .then(template=>{            
                const authTemplate = Handlebars.compile(template);
                const auth = {
                    auth:authentication
                }
                const html = authTemplate(auth);
                let div = document.getElementById('admin');
                div.innerHTML=html;
            })  
    }else{
        const html =``;
        let div = document.getElementById('admin');
        div.innerHTML=html
    }
})

//funcion para validar el mail correcto, y luego poder visualizar el centro de mensajes
function pruebaEmail(valor){    
	re=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
	if(!re.exec(valor)){		       
        $("#chatBox").slideUp(1000);
        button.disabled=false
        compresion.disabled=false   

	}else {
        $("#chatBox").slideDown(1000);        
        button.disabled = true;
        email.disabled = true;        
        nameUser.disabled =  true;
        lastName.disabled =  true;
        alias.disabled =  true; 
        age.disabled =  true;
        avatar.disabled =  true;
    }
}

//muestro en el div "log" la info obtenida desde el socket, "messagelog" es quien envia la info
socket.on('messagelog', data=>{    
    const users = new normalizr.schema.Entity('users');
    const comments = new normalizr.schema.Entity('messages', {
        sender: users
    });
    const texts = new normalizr.schema.Entity('posts', {
        messages: [ comments ]
    });
    const denormalizedData = normalizr.denormalize(data.data.result, texts, data.data.entities)   
    let normalizedLength = JSON.stringify(data.data).length;
    let denormalizedLength = JSON.stringify(denormalizedData).length;    
    compressionResult = (100 - ((normalizedLength/denormalizedLength )*100)).toFixed(0);   
    let messages = denormalizedData.messages;    
    let compresion = document.getElementById('compresion')
    compresion.innerHTML=   `<div class="container-fluid bg-light bg-gradient mb-1 ">
                                <span class="text-primary fw-bold">Compresion ${compressionResult}%</span>
                            </div>`  
    let p = document.getElementById('log')    
    if (messages){        
        let messagesData = messages.map(messageNormalized=>{            
        return `<div class="container-fluid bg-light bg-gradient mb-1 ">
                    <span class="text-primary fw-bold">${messageNormalized.sender.author} </span>
                    <span style="color:brown">[${messageNormalized.createdAt}]</span>                   
                    <span class="fst-italic text-success">: ${messageNormalized.message}</span>       
                    <span><img src='${messageNormalized.sender.avatar}' style="width:40px" ></img>             
                    </span>
                </div>`
        }).join('');
        p.innerHTML=messagesData;
    } else {
        p.innerHTML= `<div><span>Aún no hay chats</span></div>`
    }
})

//funcion para enviar un mensaje con el button "enviar mensaje"
function sendMessage(){     
    let avatarDefault 
    if (avatar.value==''){avatarDefault='http://www.w3bai.com/w3css/img_avatar3.png'}    
    let messageToSend = {
        sender: {
            id: email.value,
            author: email.value,
            name: nameUser.value,
            lastName: lastName.value,
            age:age.value,
            alias:alias.value,
            avatar:avatarDefault
        },
        message: message.value,
    };
    socket.emit('message',messageToSend); 
    message.value=""     
}

//envio de formulario para la carga de productos
document.addEventListener('submit',sendForm);

function sendForm(e){
    e.preventDefault();
    let newTitle= document.getElementById('title').value;
    let newDescription= document.getElementById('description').value;
    let newCode= document.getElementById('code').value;
    let newThumbnail= document.getElementById('thumbnail').value;
    let newPrice= document.getElementById('price').value;
    let newStock= document.getElementById('stock').value;
    let newForm ={
        title:newTitle,
        description:newDescription,
        code:newCode,
        thumbnail:newThumbnail,
        price:newPrice,
        stock:newStock
    } 
    if (!idModify) {
        fetch('/api/products',{
            method:'POST',      
            headers: { 'Content-Type': 'application/json' },        
            body:JSON.stringify(newForm)       
        }).then(response=>{
            return response.json();
        }).then(json=>{    
            
            if (json.status==="success"){
                Swal.fire({                
                    title:'Carga de producto realizada',
                    text:json.message,
                    icon:'success'                
                })
                .then(res=>{
                    location.href='/'
                })
            }else if (json.error===-2){
                Swal.fire(               
                    'No se pudo agregar producto!',
                    'No esta autorizado para esta operación.',
                    'error',           
                ).then(res=>{
                    location.href='/'
                })
            } else {
                Swal.fire({                
                    title:'Producto existente',
                    text:json.message,
                    icon:'error',            
                })
            }
        })
    } else {
        fetch(`/api/products/${idModify}`,{
            method:'PUT',      
            headers: { 'Content-Type': 'application/json' },        
            body:JSON.stringify(newForm)       
        }).then(response=>{
            return response.json();
        }).then(json=>{                
            if (json.error===-2){
                Swal.fire(                
                    'No se pudo modificar el producto!',
                    'No esta autorizado para esta operación.',
                    'error',           
                )
                .then(res=>{
                    location.href='/'
                })

            } else {
                Swal.fire(               
                    'Producto modificado!',
                    'El producto fue modificado correctamente.',
                    'success'               
                )
                .then(res=>{
                    location.href='/'
                })
            }           
            idModify = null           
        })    
    }    
}

//funcion para mostrar un boton y poder scrollear al top de la pagina
function btnScroll(boton){
    const $ScrollBtn = $(boton);    
    $(window).scroll(function(){
        let scroll = $(this).scrollTop();        
        if (scroll > 400){$ScrollBtn.removeClass('hidden')}
        else { $ScrollBtn.addClass('hidden')};
    })
    $ScrollBtn.click(function(){
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        })
    })
}

function deleteProd(id){    
    Swal.fire({
        title: 'Estas seguro de eliminar el producto?',
        text: "Esto no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar producto!'
    })
    .then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/products/${id}`,{
                method:'DELETE',                  
            })
            .then(res=>
                {if (res.status===403){                    
                    Swal.fire(
                        'No se pudo eliminar el producto!',
                        'No esta autorizado para esta operación.',
                        'error'
                        )
                    }else {                    
                        Swal.fire(
                            'Producto eliminado!',
                            'El producto fue eliminado correctamente.',
                            'success'
                        )
                        .then(res=>{
                            location.href='/'
                        })
                    }                        
                })            
        }})    
}

function modifyProd(idProduct){    
    fetch(`/api/products/${idProduct}`,{
        method:'GET'           
    })
    .then(response=>{return response.json()})
    .then(data=>{
        let {id,title,description,code,thumbnail,price,stock} = data        
        document.getElementById('title').value= title;
        document.getElementById('description').value = description;
        document.getElementById('code').value= code;
        document.getElementById('thumbnail').value= thumbnail;
        document.getElementById('price').value = price;
        document.getElementById('stock').value = stock;
        $('#updateProduct').removeClass('hidden') 
        $('#newProduct').addClass('hidden')   
        idModify=id     
    })       
}       

// llamada de la funcion
btnScroll(botonScroll);