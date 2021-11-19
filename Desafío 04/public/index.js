document.addEventListener('submit',event=>{
    event.preventDefault();       
    let newTitle= document.getElementById('title').value;
    let newPrice= document.getElementById('price').value;
    let newThumbnail= document.getElementById('thumbnail').value;
    let newForm ={title:newTitle,price:newPrice,thumbnail:newThumbnail} 
    fetch('http://localhost:8080/api/products',{
        method:'POST',      
        headers: { 'Content-Type': 'application/json' },        
        body:JSON.stringify(newForm)       
    }).then(response=>{
        return response.json();
    })
    .then(json=> {
        console.log(json);
        if (json.status=="error"){
            alert("This product is already loaded.")
        }else{
            alert("Done! New Product added")
        }
    })       
})