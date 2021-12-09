const socket = io();

let message = document.getElementById('message');
let email = document.getElementById('email');
let chatBox = document.getElementById('chatBox');
let button = document.getElementById('button');
let idModify = null
let botonScroll= $(".boton-scroll");


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
	}else {
        $("#chatBox").slideDown(1000);
        button.disabled = true;
        email.disabled = true;
    }
}
//funcion para enviar un mensaje con el button "enviar mensaje"
function sendMessage(){
    socket.emit('message',{email:email.value,message:message.value}); 
    message.value=""  
}

//muestro en el div "log" la info obtenida desde el socket, "messagelog" es quien envia la info
socket.on('messagelog',data=>{        
    let p = document.getElementById('log')        
    if (data){
        let messages = data.map(message=>{
        return `<div class="container-fluid bg-light bg-gradient mb-1 ">
                    <span class="text-primary fw-bold">${message.email} </span>
                    <span style="color:brown">[${message.date}] </span>                   
                    <span class="fst-italic text-success">: ${message.message}</span>
                </div>`
        }).join('');
        p.innerHTML=messages;
    } else {
       p.innerHTML= `<div><span>Aún no hay chats</span></div>`
    }
})

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
                        )}
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
