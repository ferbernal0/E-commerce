const socket = io();
let message = document.getElementById('message');
let email = document.getElementById('email');
let chatBox = document.getElementById('chatBox');
let button = document.getElementById('button');

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
    let newPrice= document.getElementById('price').value;
    let newThumbnail= document.getElementById('thumbnail').value;
    let newForm ={
        title:newTitle,
        price:newPrice,
        thumbnail:newThumbnail
    } 
    fetch('http://localhost:8080/api/products',{
        method:'POST',      
        headers: { 'Content-Type': 'application/json' },        
        body:JSON.stringify(newForm)       
    }).then(response=>{
        return response.json();
    }).then(json=>{
        Swal.fire({
            title:'Carga de producto realizada',
            text:json.message,
            icon:'success',
            timer:2000,
        })
        // .then(res=>{
        //     location.href='/'
        // })
    })
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

// llamada de la funcion
btnScroll(botonScroll);
