const fs = require('fs')
class Mensajes{
        constructor (nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    async saveMessages(newMessage){
        const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8')
        let mensajes = []
        const listaDeMensajes = JSON.parse(contenido);
        listaDeMensajes.push(newMessage);
        mensajes = listaDeMensajes
        const mensajeString = JSON.stringify(mensajes, null, 2)
        await fs.promises.writeFile(`./${this.nombreArchivo}`, mensajeString);
    }

    async getMessagess (){
        const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`,'utf-8');
        const listaDeMensajes = JSON.parse(contenido);
        return listaDeMensajes
    };
}

module.exports = Mensajes