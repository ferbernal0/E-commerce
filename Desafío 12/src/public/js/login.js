
let form = document.getElementById('loginForm');
form.addEventListener('submit',function(event){
    event.preventDefault();
    let info = new FormData(form);
    let sendObject={
        email:info.get('login_email'),
        password:info.get('login_password')
    }
    fetch('/login',{
        method:"POST",
        body:JSON.stringify(sendObject),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json())
    .then(json=>{
        console.log(json);
        if(json.error){
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'No se encontro usuario',
                showConfirmButton: true,
                timer: 2000
              }).then(res=>location.replace('./login.js'))                
            console.log(json.error);        
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Usuario logueado correctamente',
                showConfirmButton: false,
                timer: 2000,
            }).then(res=>location.replace('../index.html')) 
        }
    }).catch(err=>console.log('No existe usuario'))
})