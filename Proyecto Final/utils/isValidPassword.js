const bcrypt= require('bcrypt')

/**
 * 
 * @param {object} user 
 * @param {string} password 
 * @returns {boolean}
 */
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}


module.exports = isValidPassword;