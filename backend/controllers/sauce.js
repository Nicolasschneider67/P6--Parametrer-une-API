const Sauce = require("../models/Sauce");
const fs = require('fs'); //Nous donne accès aux fonctions permettant de supprimer ou modifier des fichiers

//Pour voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

//Pour voir une sauce en particulier
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//Pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  delete sauceObject._userId;  //Empêche de faire croire que c'est une autre personne qui a crée l'objet
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

//Pour modifier une sauce
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),  //Si la modification apporte une image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
    
    : { ...req.body }  //Si la modification n'apporte pas d'image
  
  delete sauceObject._userId; //Pour éviter qu'une personne ne créer un fichier et ne l'assigne à une autre personne
  Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
  .then(res.status(200).json({ message : "Sauce modifiée"}))
  .catch(error => res.status(400).json({ message: "Vous n'êtes pas autorisé à modifier les sauces des autres" }))
}

//Pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id : req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split("/images/")[1]
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({_id : req.params.id})
  .then(res.status(200).json({ message: "Sauce supprimée" }))
  .catch(error => res.status(400).json({ error }))
  
    })
  })
  .catch(error => res.status(500).json({ error }))
}

//Fonction des likes
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  switch (like) {
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `I like` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 :
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `I don't like` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}