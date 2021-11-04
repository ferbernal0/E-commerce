class Usuario {
    constructor (nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = [libros];
        this.mascotas = [mascotas]
    }

    getFullName(){
        return console.log(`El nombre completo es ${this.nombre} ${this.apellido}`)
    }
    
    addMascota(mascotaNew){
        this.mascotas.push(mascotaNew)
    }

    countMascotas(){
        return console.log(this.mascotas.length)
    }

    addBook(nombreNew, autorNew){
        this.libros.push({nombre : nombreNew, autor : autorNew})
    }

    getBookNames(){
        const listaLibros = []
        for (let i = 0; i < this.libros.length; i++) {
            listaLibros.push(this.libros[i].nombre)
        }
        return console.log(listaLibros);
    }
}

const usuario = new Usuario("Albert","Einstein",{nombre: "Juego de Tronos", autor : "George R. R. Martin"},"Perro");

usuario.getFullName();

usuario.addMascota("Loro");
usuario.addMascota("Gato");

usuario.countMascotas();

usuario.addBook("El Señor de los Anillos", "J. R. R. Tolkien");
usuario.addBook("Rebelión en la Granja", "George Orwell")

usuario.getBookNames();