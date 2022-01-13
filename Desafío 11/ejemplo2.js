import { schema } from "normalizr"


const initialData = {
    "id":"library",
    "books":[
        {
            "id":"1",
            "author":{
                "id":"1",
                "first_name":"Lizbeth Marisol",
                "last_name":"Cadena Dueñas",
                "age":"23",
                "nationality":"mexican"
            },
            "title":"Los señores de los duendes",
            "genres":[
                {
                    "id":"1",
                    "name":"Science Fiction",
                    "subgenres":[
                        {
                            "id":"1",
                            "name":"Contemporary"
                        },
                        {
                            "id":"2",
                            "name":"Magical Realism"
                        }
                    ]
                },
                {
                    "id":"2",
                    "name":"Thriller and suspense",
                    "subgenres":[
                        {
                            "id":"1",
                            "name":"Contemporary"
                        }
                    ]
                }
            ],
            "price":"250"
        },
        {
            "id":"2",
            "author":{
                "id":"2",
                "first_name":"Stephanie",
                "last_name":"Meyer",
                "age":"35",
                "nationality":"american"
            },
            "title":"Twilight",
            "genres":[
                {
                    "id":"3",
                    "name":"Fiction",
                    "subgenres":[
                        {
                            "id":"4",
                            "name":"Vampires"
                        }
                    ]
                },
                {
                    "id":"4",
                    "name":"Romance",
                    "subgenres":[]
                }
            ],
            "price":"300",
        },
        {
            "id":"3",
            "author":{
                "id":"2",
                "first_name":"Stephanie",
                "last_name":"Meyer",
                "age":"35",
                "nationality":"american"
            },
            "title":"New Moon",
            "genres":[
                {
                    "id":"3",
                    "name":"Fiction",
                    "subgenres":[
                        {
                            "id":"4",
                            "name":"Vampires"
                        }
                    ]
                },
                {
                    "id":"4",
                    "name":"Romance",
                    "subgenres":[]
                }
            ],
            "price":"350"
        },
        {
            "id":"4",
            "author":{
                "id":"3",
                "first_name":"Gabriel",
                "last_name":"García Márquez",
                "age":"P.A."
            },
            "title":"100 años de soledad",
            "genres":[
                {
                    "id":"4",
                    "name":"Fantasy",
                    "subgenres":[
                        {
                            "id":"5",
                            "name":"High Fantasy"
                        },
                        {
                            "id":"2",
                            "name":"Magical Realism"
                        }
                    ]
                }
            ]
        }
    ]
}

const subgenres = new schema.Entity('subgenres');

const genres = new schema.Entity('genres',{
    subgenres:[subgenres]
})

const author = new schema.Entity('author')