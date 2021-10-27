class Usuario {

    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName () {
        return `${this.nombre} ${this.apellido}`; }

    addBook () {
        let libro = {nombre: nombre, autor:autor};
        this.libros.push(libro); }

    getBooks() {
        return this.libros.map(libro => libro.nombre); }

    addMascotas() {
        this.mascotas.push(mascota); }

    getMascotas() {
        return this.mascotas.length; }
}

let lucas = new Usuario ('Albert', 'Einstein', [{nombre: 'Diario del ladrón', autor: 'Jean Genet'}, {nombre: 'Miedo y asco en Las Vegas', autor: 'Hunter S. Thompson'}],['Firulais','Michi']);

console.log(lucas.getFullName());

console.log(lucas.getBooks());

console.log(lucas.getMascotas());