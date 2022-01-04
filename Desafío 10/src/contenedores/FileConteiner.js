import config from '../config.js'

//creo la clase de sistema de archivos, recibira dependiendo de sus hijos la ruta del archivo donde apunta cada uno
export default class FileConteiner{
    constructor(file_endpoint){
        this.url=`${config.fileSystem.baseUrl}${file_endpoint}`
    }
}