const mongoose = require('mongoose') //Nous avons besoin d'importer la base de données pour stocker les things/sauces

//Nous créons un schéma qui devra être respecté pour chaque sauce. L'id de l'image n'est pas obligatoire car il est généré par Mongoose
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true},
  description: { type: String, required: true },
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true},
  likes: { type: Number }, //Tout ce qui se réfère aux likes n'est pas obligatoire car l'user peut ne pas donner son avis
  dislikes: { type: Number},
  usersLiked: { type: [String] },
  usersDisliked: { type: [String]},
})

module.exports = mongoose.model('Sauce', sauceSchema)