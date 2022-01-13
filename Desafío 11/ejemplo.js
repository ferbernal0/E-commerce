import {normalize,denormalize,schema} from 'normalizr';
import util from 'util'

const initialData ={
    "id": "1",
    "author": {
      "id": "1",
      "name": "Paul"
    },
    "title": "¿Por qué usar React, Vue o Angular, en lugar de Vanilla Javascript?",
    "content":"EXPLICACION",
    "comments":[
      {
        "id": "1",
        "commenter": {
            "id": "2",
            "name": "Nicole"
          },
        "content":"¡Excelente post!"
      },
      {
          "id":"2",
          "commenter":{
              "id":"2",
              "name":"Nicole"
          },
          "content":"¿En qué te inspiraste?"
      },
      {
          "id":"3",
          "commenter":{
              "id":"1",
              "name":"Paul"
          },
          "content":"¡Gracias!, me inspiré en los problemas de Javascript"
      },
      {
        "id":"4",
        "commenter":{
            "id":"1",
            "name":"Paul"
        },
        "content":"Por cierto, También vi tu artículo sobre ExpressJS con Mongo, ¡una pasada!"
      },
      {
          "id":"5",
          "commenter":{
              "id":"3",
              "name":"Boris"
          },
          "content":"¡Gracias, me fue de mucha ayuda!"
      }
    ]
}

const users = new schema.Entity('users');
const comments = new schema.Entity('comments',{
    commenter:users
})

const posts = new schema.Entity('posts',{
    author:users, 
    comments:[comments]
})

const normalizedData= normalize(initialData,posts)

// console.log(JSON.stringify(normalizedData,null,2))

const denormalizedData = denormalize(normalizedData.result,posts,normalizedData.entities)

// console.log(JSON.stringify(denormalizedData,null,2))

// console.log(util.inspect(normalizedData,false,1,true))

console.log(JSON.stringify(initialData).length)
console.log('vs')
console.log(JSON.stringify(normalizedData).length)