const save =(length) => {
    let result = '';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let caracteresLenght = caracteres.length;
    for ( let i = 0; i < length; i++ ) {
        result += caracteres.charAt(Math.floor(Math.random() * caracteresLenght));
    }
    return result;
}

module.exports = save;