'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

// Modelos
var Follow = require('../models/follow');

//servicios
var jwt = require('../services/jwt');

function saveFollow(req, res) {
  var params = req.body;

  console.log({parametros :params});
  if (!params.followed)  return res.status(500).send({message: 'Parametros incompletos'});

  var follow = new Follow();
  follow.user = req.user.sub;
  follow.followed = params.followed;

  follow.save((err, followStored) => {
    console.log(err);
     if (err || !followStored) return res.status(500).send({message: 'Error al guardar followStored'});
     return res.status(200).send({message: 'Follow Guardado', 'follow': followStored});
  });
};



function deleteFollow(req, res) {
  var userId = req.user.sub;
  var followId = req.params.id;
  Follow.find({'user':userId, 'followed':followId}).remove((err) => {
     if (err) return res.status(500).send({message: 'Error al borrar followStored'});
     return res.status(200).send({message: 'Follow Borrado'});
  });
};


function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) userId = req.params.id;

    var page = 1;
    if (req.params.page) page = req.params.page;

    var itemsPerPage = 5;
    if (req.params.itemsPerPage) itemsPerPage = req.params.itemsPerPage;

    Follow.find({'user':userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
      if (err) return res.status(500).send({message: 'Error al buscar followins'});
      if (!follows) return res.status(404).send({message: 'Error followins no encontrados'});

      res.status(200).send({
        message: 'success',
        follows, total,
        pages: Math.ceil(total/itemsPerPage)
      });
    });
};


function getFollowedUsers(req, res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) userId = req.params.id;

    var page = 1;
    if (req.params.page) page = req.params.page;

    var itemsPerPage = 5;
    if (req.params.itemsPerPage) itemsPerPage = req.params.itemsPerPage;

    Follow.find({'followed':userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
      if (err) return res.status(500).send({message: 'Error al buscar followers'});
      if (!follows) return res.status(404).send({message: 'Error followers no encontrados'});

      res.status(200).send({
        message: 'success',
        follows, total,
        pages: Math.ceil(total/itemsPerPage)
      });
    });
};

// usuarios que sigo
function getMyFollows(req, res) {
  var userId = req.user.sub;

  var find = Follow.find({'user':userId}).populate('followed');
  if (req.params.followed ) find = Follow.find({'followed':userId}).populate('user');

  find.exec((err, follows) => {
    if (err) return res.status(500).send({message: 'Error al buscar followers'});
    if (!follows) return res.status(404).send({message: 'Error followers no encontrados'});

    res.status(200).send({message: 'success',follows});
  });
};



function home(req, res) {
  var params = req.body;
  res.status(200).send({message: 'Home Follow'});
};


module.exports = {
  home,
  saveFollow,
  deleteFollow,
  getFollowingUsers,
  getFollowedUsers,
  getMyFollows
}
