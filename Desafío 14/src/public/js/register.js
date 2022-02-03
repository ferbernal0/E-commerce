let form  = document.getElementById("registerForm");
form.addEventListener('submit',function(event){
    event.preventDefault();
    let info = new FormData(form);
    let sendObject ={
        name:info.get('register_first_name'),
        lastName:info.get('register_last_name'),
        age:info.get('register_age'),
        username:info.get('register_username'),
        email:info.get('register_email'),
        avatar:info.get('register_avatar'),
        password:info.get('register_password')
    }
    // let sendObject={}
    // let data = new FormData(form)
    // data.forEach((value,key)=>sendObject[key]=value)


    fetch('/register',{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        'Accept': 'application/json',
        body:JSON.stringify(sendObject),
    }).then(result=>{
        console.log(result);
        return result.json()
    }).then(json=>{
        form.reset();        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario registrado',
            showConfirmButton: false,
            timer: 2500
          }).then(res=>location.replace('../pages/login.html'))
        })
        
})

