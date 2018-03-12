'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');

// Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

//servicios
var jwt = require('../services/jwt');



function savePublication(req, res) {
  var params = req.body;
  var publication = new Publication();
  // check campos obligatorios
  if(!params.text){
    console.log(req);
    return res.status(403).send({message: 'Faltan campos Obligatorio'});
  }
  publication.text = params.text;
  publication.user = req.user.sub;
  publication.created_at = moment().unix();
  publication.file = null;

  publication.save().then((publication) => {
    if (!publication) return res.status(404).send({message: 'Publicacion no  se guardo'});
    return res.status(200).send({message: 'success', publication});
  }).catch((err) => {
    return res.status(500).send({message: 'Error al guardar = '+err});
  });
};

function getPublications(req, res) {
  var page = 1;
  if (req.params.page) page = req.params.page;

  var itemsPerPage = 5;

  Follow.find({user: req.user.sub}).populate('followed').exec().then((follows) => {
    if (!follows) return res.status(500).send({message: 'No hay seguidores'});
    var follows_clean = [];
    follows.forEach((follow) => {
      follows_clean.push(follow.followed);
    });

    Publication.find({user: follows_clean}).sort('-cleated_at')
    .populate('user').paginate(page, itemsPerPage).exec()
    .then((publication) => {
        res.status(200).send({message: 'publication User', follows_clean, publication});
    }).catch((err) => {
      return res.status(500).send({message: 'error getPublications = '+err});
    });


  }).catch((err) => {
    return res.status(500).send({message: 'error getPublications = '+err});
  });


};

function getPublication(req, res) {
  var publicationId = req.params.id;
  Publication.findById(publicationId).populate('user').exec().then((publication) => {
      res.status(200).send({message: 'success', publication});
  }).catch((err) => {
    return res.status(500).send({message: 'error getPublications = '+err});
  });
};

function deletePublication(req, res) {
  var publicationId = req.params.id;
  Publication.findById(publicationId).exec().then((publication) => {
    if (!publication) return res.status(404).send({message: 'no encontrada'});
    if (publication.user != req.user.sub)  return res.status(403).send({message: 'publicaciokn ajena'});
    publication.delete().then((publication) => {
      res.status(200).send({message: 'success', publication});
    });
  }).catch((err) => {
    return res.status(500).send({message: 'error deletePublication = '+err});
  });
};


function uploadImage(req, res){
  var publicationId = req.params.id;
  var file_name = 'No subido...';

  //if (userId != req.user.sub) return res.status(403).send({message: 'No tienes permisoss'});
  console.log(req.files);
  if (!req.files) return res.status(200).send({message: 'No hay fichers'});
  //console.log(req.files.image.path);
  var file_path = req.files.image.path;
  var file_split = file_path.split('\\');
  var file_name = file_split[2];

  var ext_split = file_name.split('.');
  var file_ext = ext_split[1];

  if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'git') {
    return removeFiles(res, file_path, '200', 'Extencion invalida');
  }

  console.log({'reqUser':req.user});
    Publication.findOne({'_id':new ObjectId(publicationId), 'user': new ObjectId(req.user.sub)}).exec().then((publication) => {
    console.log({'este':publication});
    if (!publication) return removeFiles(res, file_path, '400', 'Publicacion no encontrada');
    publication.file = file_name;
    publication.save().then((saverPublication) => {
        res.status(200).send({file_path, file_split, file_name, publication: saverPublication});
    }).catch((err) => {
      return removeFiles(res, file_path, '500', 'Error en save');
    });

  }).catch((err) => {
    return removeFiles(res, file_path, '500', 'Error en find');
  });
}


function removeFiles(res, file_path, code, message){
  console.log('borrando archivo : '+file_path+' message :'+message);
  fs.unlink(file_path, (err) => {
    if (err) return res.status(500).send({message: 'archivos no borrado y'+message});
    return res.status(code).send({message});
  });
}


function getImageFile(req, res){
  console.log(req.params.imageFile);
  var imageFile = req.params.imageFile;
  var file_path = './uploads/publications/'+imageFile;

  fs.exists(file_path, function(exists) {
    if (!exists) return res.status(404).send({message: 'NO existe'});
    res.sendFile(path.resolve(file_path));
  });
}



function home(req, res) {
  var params = req.body;
  res.status(200).send({message: 'publication User'});
};

module.exports = {
  home,
  savePublication,
  getPublications,
  getPublication,
  deletePublication,
  uploadImage,
  getImageFile
}
