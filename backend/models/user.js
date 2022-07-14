//On déclare la base de donnée
const mongoose = require("mongoose");
//On déclare le pluggin permettant de n'avoir qu'un seul utilisateur
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);