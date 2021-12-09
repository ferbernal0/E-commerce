document.addEventListener('submit',sendForm);

function sendForm(e){
    e.preventDefault();
    let form= document.getElementById('prodForm');
    let data = new FormData(form);
    fetch('/api/products',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Producto Creado',
            text:json.message,
            icon:'success',
            timer:3000,
        }).then(result=>{
            location.href='/'
        })
    })
}

document.getElementById("thumbnail").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "¡A subir la imagen ;)!"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}