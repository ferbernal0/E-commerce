class Estudiante{
    constructor(nombre,apellido,correo,desafios,profesor){
        this.nombre= nombre;
        this.apellido=apellido;
        this.correo=correo;
        this.desafios=desafios;
        this.profesor=profesor;
    }
    //métodos
    getFullName(){
        return `${this.nombre} ${this.apellido}`
    }
    obtenerDesafios(){
        return this.desafios;
    }
    agregarDesafio(desafio){
        this.desafios.push(desafio);
    }
    aprobarDesafio(id){
        this.desafios.forEach(desafio=>{
            if(desafio.id===id){
                desafio.status="aprobado";
            }
        })
    }
}

let estudiante1 = new Estudiante('Mauricio','Espinosa','correo@correo.com',[],{nombre:"Juan",apellido:"Escutia"});
let desafio ={
    id:1,
    nombre:"Desafio 1",
    descripcion:"desafio sobre clases de javascript",
    status:"pendiente",
}
estudiante1.agregarDesafio(desafio);

estudiante1.agregarDesafio({
    id:2,
    nombre:"Desafio 2",
    descripcion:"Desafio sobre archivos de javascript",
    status:"pendiente",
})

estudiante1.aprobarDesafio(2);
console.log(estudiante1);