'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var ObjectId = require('mongoose').Types.ObjectId;

// Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');


//servicios
var jwt = require('../services/jwt');


function saveUser(req, res) {
  var user = new User();
  var params = req.body;

  // check campos obligatorios
  console.log("check campos obligatorios");
  if(!params.name || !params.surname || !params.nick || !params.email || !params.password ){
    return res.status(403).send({message: 'Faltan campos Obligatorio'});
  }

  user.name = params.name;
  user.surname = params.surname;
  user.nick = params.nick;
  user.email =  params.email;

  // check registros repetidos
  console.log("check registros repetidos");
  User.find({
    $or: [
      {email: user.email.toLowerCase()},
      {nick: user.nick.toLowerCase()}
    ]}
  ).exec((err, users) => {
    console.log({'UsersFind':users});
    if (err) return res.status(500).send({message: 'Error al guardar'});
    if (users && users.length > 0) {
      return res.status(200).send({message: 'Usuario Repetido'});
    } else {
      // cifrar password y guarda
      console.log("cifrar password y guarda");
      bcrypt.hash(params.password, null, null, (err, hash) => {
         user.password = hash;
         user.save((err, userStored) => {
            if (err || !userStored) return res.status(500).send({message: 'Error al guardar'});
            return res.status(200).send({message: 'Usuario Guardado', 'user': userStored});
         });
       });
    }
  });
};

function loginUser(req, res) {
  var params = req.body;
  var email = params.email;
  var password = params.password;
  // buscar user
  User.findOne({email: email.toLowerCase()}).exec((err, user) => {
    if (err) return res.status(500).send({message: 'Error al buscar user'});
    if (!user) return res.status(404).send({message: 'Error usuario no encontrado'});
    //check password
    bcrypt.compare(password, user.password, (err, check) => {
      if (err) return res.status(500).send({message: 'Error al decodificar user'});
      if (!check) return res.status(404).send({message: 'Error pass incorrecto'});
      if (params.gettoken){
        res.status(200).send({message: 'Usuario logeado', token: jwt.createToken(user)});
      } else {
        user.password = undefined;
        res.status(200).send({message: 'Usuario logeado', user});
      }
    });
  });
};

function getUser(req, res) {
  var userId = req.params.id;
  User.findById(userId).then((user) => {
    if (!user) return res.status(404).send({message: 'Error usuario no encontrado'});
    followThisUser(req.user.sub, userId).then((value) => {
      user.password = undefined;
      res.status(200).send({
        message: 'success',
        user,
        following: value.following,
        followed: value.followed
      });
    });

  }).catch((err) => {
    return res.status(500).send({message: 'Error al buscar user'});
  });
};


async function followThisUser(identity_user_id, user_id){

  var following = await Follow.findOne({"user":identity_user_id, "followed": user_id})
  .exec().catch((err) => {console.log(err);});

  const followed = await Follow.findOne({"user":user_id, "followed": identity_user_id})
  .exec().catch((err) => {console.log(err);});

  return { following:following, followed:followed };
};

function getCounters(req, res) {
  var userId = req.user.sub;
  if(req.params.id) userId = req.params.id;

  getCountFollow(userId).then((value) => {
    res.status(200).send({
      message: 'success',
      following: value.following,
      followed: value.followed,
      publications: value.publications
    });
  }).catch((err) => {
    return res.status(500).send({message: 'Error al contadores error:'+err});
  });


}

async function getCountFollow(user_id){
   var following = await Follow.count({"user":user_id}).exec().catch((err) => {
     console.log('following getCount = '+err);
   });
   var followed = await Follow.count({"followed":user_id}).exec().catch((err) => {
     console.log('followed getCount = '+err);
   });
   var publications = await Publication.count({"user":user_id}).exec().catch((err) => {
     console.log('publications getCount = '+err);
   });
   return { following : following, followed: followed, publications:publications };
}

function getUsers(req, res) {
  var identity_user_id = req.user.sub;
  var page = 1;
  var itemsPerPage = 2;

  if (req.params.page) page = req.params.page;
  console.log({reqparamspage:req.params.page});
  User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
    if (err) return res.status(500).send({message: 'Error al buscar users'});
    if (!users) return res.status(404).send({message: 'Error usuarios no encontrados'});

    followUserIdes(identity_user_id).then((value) => {
      res.status(200).send({
        message: 'success',
        users, total,
        users_following: value.following,
        users_follo_me: value.followed,
        pages: Math.ceil(total/itemsPerPage),

      });

    });

  });
};

async function followUserIdes(user_id){
  var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0 }).exec()
      .then((follows) => {
        var follows_clean = [];
        follows.forEach((follow) => {
          follows_clean.push(follow.followed);
        });
        return follows_clean;
      }).catch((err) => {
        console.log('error follows_clean = '+err);
      });
  var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0 }).exec()
      .then((follows) => {
        var follows_clean = [];
        follows.forEach((follow) => {
          follows_clean.push(follow.user);
        });
        return follows_clean;
      }).catch((err) => {
        console.log('error follows_clean = '+err);
      });
  return { following:following, followed:followed };
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;
  delete update.password;
  console.log(update);
  if (userId != req.user.sub) return res.status(403).send({message: 'No tienes permisos'});
  if (!update.email || !update.nick || !update.name || !update.surname) return res.status(403).send({message: 'Faltan Campos'});

  User.find({
      $or: [
        {email: update.email.toLowerCase()},
        {nick: update.nick.toLowerCase()}
    ]
  }).exec((err, findUsers) => {
    console.log({'UsersFind':findUsers});
    if (err) return res.status(500).send({message: 'Error al guardar'});
    var finded = false;

    findUsers.forEach((findUser) => {
      if (findUser && findUser._id != userId) finded = true;
    });

    if (finded) {
      return res.status(200).send({message: 'Mail o Nick ya en uso por otro usuario'});
    } else {
      User.findByIdAndUpdate(userId, update, {new :true}, (err, userUpdated) => {
        console.log(err);
        if (err) return res.status(500).send({message: 'Error al buscar user'});
        if (!userUpdated) return res.status(404).send({message: 'Error usuario no encontrado'});
        userUpdated.password = undefined;
        res.status(200).send({message: 'success', userUpdated});
      });
    }
  });

}


function removeFiles(res, file_path, code, message){
  fs.unlink(file_path, (err) => {
    if (err) return res.status(500).send({message: 'archivos no borrado y'+message});
    return res.status(code).send({message});
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if (userId != req.user.sub) return res.status(403).send({message: 'No tienes permisoss'});
  //console.log(req.files);
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
  console.log(req.user);
  User.findByIdAndUpdate(userId, { image: file_name}, {new :true}, (err, userUpdated) => {
    if (err) return removeFiles(res, file_path, '500', 'Error al buscar user');
    if (!userUpdated) return removeFiles(res, file_path, 404, 'Error usuario no encontrado');
    userUpdated.password = undefined;
    res.status(200).send({file_path, file_split, file_name, user: userUpdated});
  });
}


function getImageFile(req, res){
  console.log(req.params.imageFile);
  var imageFile = req.params.imageFile;
  var file_path = './uploads/users/'+imageFile;

  fs.exists(file_path, function(exists) {
    if (!exists) return res.status(404).send({message: 'NO existe'});
    res.sendFile(path.resolve(file_path));
  });
}


function home(req, res) {
  var params = req.body;
  res.status(200).send({message: 'Home User'});
};

module.exports = {
  home,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  uploadImage,
  getImageFile,
  getCounters
}
