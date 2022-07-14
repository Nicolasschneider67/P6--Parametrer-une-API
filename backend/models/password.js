//On appelle le pluggin password validator
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) //minimum 8 caractères                                    
.is().max(100)// maximum de 100 caractères                                  
.has().uppercase(1) //Doit contenir des majuscules                         
.has().lowercase() //Doit contenir des minuscules                      
.has().digits(1) //Doit contenir une lettre                               
.has().not().spaces() //Pas d'espaces autorisés


module.exports = passwordSchema;