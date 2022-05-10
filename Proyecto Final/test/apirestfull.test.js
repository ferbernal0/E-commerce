const request = require('supertest')('http://localhost:8080/')
const expect = require('chai').expect

const productoPost = 
    {
        "nombre": "Cadena de Bicicleta",
        "precio": "55",
        "foto": "https://http2.mlstatic.com/D_NQ_NP_859885-MLA46635972314_072021-O.jpg"
      }

const productoPut=
    {
    "nombre": "Cadena de Bicicleta PUT",
    "precio": "56",
    "foto": "https://http2.mlstatic.com/D_NQ_NP_859885-MLA46635972314_072021-O.jpg"
  }

describe('Test api rest full with Supertest Chai Mocha', () => {
    describe('GET', () => {
        it ('Debería retornar un status 200', async () =>{
            let responseGet = await request.get('home')
        expect(responseGet.status).to.eql(200)})
    })

    describe('POST', () => {
        it ('Debería incorporar un producto', async () =>{
            let responsePost = await request.post('productos').send(productoPost)
        expect(responsePost.status).to.eql(302)

        })
    })
    describe('PUT', () => {
       it ('Debería modificar un producto', async () =>{
           let responsePut = await request.put('productos/6').send(productoPut)
       expect(responsePut.status).to.eql(200)

       })
   })
    describe('DELETE', () => {
        it ('Debería eliminar un producto', async () =>{
            let responseDelete = await request.delete('productos/6')
        expect(responseDelete.status).to.eql(200)

        })
    })
})