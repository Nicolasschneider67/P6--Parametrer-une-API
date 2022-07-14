require('dotenv').config(); // Pour sécuriser l'affichage de nos variables
const express = require("express"); // Déclaration du framework Express
const mongoose = require("mongoose"); // Déclaration de notre base de donnée
const helmet = require('helmet'); //Sécurité de nos en-tête
const path = require("path"); //Affichage dynamique des éléments transférés par les user commme les images
const cors = require("cors"); //Règle les problèmes d'inter-connexion

const userRoutes = require('./routes/user') //Déclaration de la route des users
const sauceRoutes = require('./routes/sauce');//Déclaration de la route des sauces

mongoose
  .connect(
    process.env.SECRET_DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  const app = express();
  
//Méthode CORS pour relier les différents ports, accepter toutes les requêtes énnoncées et accepter les en-tête
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});



app.use(express.json()); //Transformer les réponses au format JSON
app.use(helmet({ crossOriginResourcePolicy: false })) //Sécurise les en-tête, nous rajouter cette conditions pour un affichage des images
app.use(cors())


//Début du endpoint après avoir défini le port d'entrée
app.use('/api/auth', userRoutes); //Pour les utilisateurs
app.use('/api/sauces', sauceRoutes); //Pour les sauces
app.use('/images', express.static(path.join(__dirname, 'images'))); //Pour les images
 
module.exports = app;