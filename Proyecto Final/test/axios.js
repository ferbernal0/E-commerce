const axios = require('axios');

async function getProducts(){
    return await axios.get('http://localhost:8080/home')
}

async function postProducts(){
    return await axios.post('http://localhost:8080/productos',
    {
        "nombre": "Rueda Bicicleta MTB 26",
        "precio": "5",
        "foto": "https://contents.mediadecathlon.com/p1333/k$3a115af4670642212ca83006afe2ea23/sq/rueda-bicicleta-mtb-26-delantera-v-brake-pared-simple-negra.jpg?format=auto&f=640x640",
        "id": 5
      })
}

async function deleteProduct(){
    return await axios.delete('http://localhost:8080/productos/6')
}

async function putProduct(){
    return await axios.put('http://localhost:8080/productos/6',
    {"nombre" : "Rueda 26 New with .put"})
}

const testAxios = () =>{
    Promise.all([getProducts(), postProducts(), deleteProduct(),putProduct()])
        .then(function(results){
            const getAxios = results[0];
            const postAxios = results[1];
            const deleteAxios = results[2];
            const putAxios = results[3]
        })
    }

module.exports = {testAxios}