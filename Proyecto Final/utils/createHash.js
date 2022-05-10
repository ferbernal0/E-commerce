const bcrypt = require('bcrypt')


/**
 * 
 * @param {string} password - The password to be hashed
 * @returns {string} password hashed
 */
const createHash = (password) => bcrypt.hashSync(
  password,
  bcrypt.genSaltSync(10),
  null);

module.exports= createHash;