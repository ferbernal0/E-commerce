const fs = require('fs')
class Contenedor {

    constructor (nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

        async save(newProduct){
            try{

                //1. Lee el archivo
                const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8')
                let productos = []

                //2. Crea el ID

                //2.1. Si no hay datos, crea id : 1
                if (contenido === ''){
                    newProduct.id = 1;
                    productos.push(newProduct);

                } else { //2.2 Si hay un ID, suma al anterior
                    const listaDeProductos = JSON.parse(contenido);
                    newProduct.id = listaDeProductos[listaDeProductos.length -1].id + 1;
                    listaDeProductos.push(newProduct);
                    productos = listaDeProductos
                }

                // 3. Guarda el producto en el JSON
                const productoString = JSON.stringify(productos, null, 2)
                await fs.promises.writeFile(`./${this.nombreArchivo}`, productoString);
                console.log('Se guardó de forma correcta el producto')

                // 4. Regresa ID
                return newProduct.id

            } catch(error) {
                console.error('Error: ', error)
            }
        }

    async getById(number){
        try{
            const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8');
            const listaDeProductos = JSON.parse(contenido)
            const resultadoId = listaDeProductos.find(numero => numero.id === number)
            if (resultadoId === undefined){
                return null
            } else{
                return resultadoId
            }
        } catch (error){
            console.error('Error de lectura',error)
        }
        
    }

    async getAll(){
        try {
            const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8');
            const listaDeProductos = JSON.parse(contenido);
            //console.log('Todos los productos disponibles: ',listaDeProductos)
            return listaDeProductos;
        }
        catch (error){
            console.error('Error de lectura',error)
        }
    }

    async deleteById(numero){
        try{
            const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8');
            const listaDeProductos = JSON.parse(contenido)

            const resultadoId = listaDeProductos.find(number => number.id === numero)
            if (!resultadoId){
                return null
            } else{
                const index = listaDeProductos.indexOf(resultadoId);
                listaDeProductos.splice(index, 1);
                const listaNew = JSON.stringify(listaDeProductos)
    
                await fs.promises.writeFile(`./${this.nombreArchivo}`,listaNew);
                console.log('El producto seleccionado se eliminó de forma correcta')
            }

        } catch (error){
            console.error('Error de lectura',error)
        }
    }



    async deleteAll(){
        try {
            const contenido = await fs.promises.writeFile(`./${this.nombreArchivo}`,'');
            console.log('Se eliminaron todos los productos de forma correcta')
        }
        catch (error){
            console.error('Error de lectura',error)
        }
    }

    async update(id, producto){
        try {
            const list = await this.getAll();
            const productoSaved = list.find((item) => item.id === parseInt(id))
            const indexProductoSaved = list.findIndex((item) => item.id === parseInt(id))
    
            if (!productoSaved){
                console.log(`Error con el Id: ${id} no fue encontrado`)
                return null
            }
    
            const productoUpdate = {
                ...productoSaved, // SE COPIAN TODOS LOS ATRIBUTOS DE PRODUCTOSAVED EN PRODUCTOUPDATE
                ...producto // SE COPIAN Y PISAN TODOS LOS ATRIBUTOS DE PRODUCTO EN PRODUCTOUPDATE. ESTO PASA PORQUE NO PUEDE HABER DOS DATOS IGUALES EN JSON
            };
            // SE PONE EL NUEVO ELEMENTO EN LA LISTA
            list[indexProductoSaved] = productoUpdate
    
            console.log(list[indexProductoSaved])
    
            // SE GUARDA LA LISTA
            const elementString = JSON.stringify(list, null, 2)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, elementString);
    
            return productoUpdate
        }
        catch (error){
            console.error('Error de lectura',error)
        }
    }
}


module.exports = Contenedor;

