const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async(password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword; //podríamos hacerlo directamente en una línea, con return await... etc
}
const checkPassword = async(originalPassword, hashedPassword) => {
    const passwordMatch = await bcrypt.compare(originalPassword, hashedPassword) 
    //console.log({passwordMatch, originalPassword, hashedPassword})QUITAR QUITAR QUITAR QUITAR 
    return passwordMatch
}

module.exports = { hashPassword, checkPassword }