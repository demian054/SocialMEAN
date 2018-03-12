'use strict'
// modulos
//var bcrypt = require('bcrypt-nodejs');
//var fs = require('fs');
//var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');

// Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');


//servicios
var jwt = require('../services/jwt');

function saveMessage(req, res) {
  var params = req.body;
  console.log(params);
  if (!params.text || !params.receiver) return res.status(403).send({message: ' faltan campos'});

  var message = new Message();

  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.viewed = false;
  message.created_at = moment().unix();

  message.save().then((savedMessage) => {
    if(!savedMessage) return res.status(404).send({message: 'error saveMessage: no salvo '});
    res.status(200).send({message: 'success', message: savedMessage});
  }).catch((err) => {
    return res.status(500).send({message: 'error saveMessage = '+err});
  });
};

function getReceivedMessages(req, res) {
  var userId = req.user.sub;
  var page = 1;
  var itemsPerPage = 5;

  if (req.params.page) page = req.params.page;

  Message.find({receiver: new ObjectId(userId)})
  .populate('emitter', 'name surname _id nick image').sort('-created_at')
  .paginate(page, itemsPerPage, (err, messages, total ) => {
    if(err) return res.status(500).send({message: 'Error al buscar mensajes'});
    console.log(total);
    if (!messages || messages.length<1 ) return res.status(200).send({message: 'no encontrados'});
      res.status(200).send({
        message: 'success',
        messages: messages,
        page, pages: Math.ceil(total/itemsPerPage), total
    });
  });
};

function getEmmitMessages(req, res) {
  var userId = req.user.sub;
  var page = 1;
  var itemsPerPage = 5;

  if (req.params.page) page = req.params.page;

  Message.find({emitter: new ObjectId(userId)})
  .populate('emitter receiver', 'name surname _id nick image').sort('-created_at')
  .paginate(page, itemsPerPage, (err, messages, total ) => {
    if(err) return res.status(500).send({message: 'Error al buscar mensajes'});
    console.log(total);
    if (!messages || messages.length<1 ) return res.status(200).send({message: 'no encontrados'});
      res.status(200).send({
        message: 'success',
        messages: messages,
        page, pages: Math.ceil(total/itemsPerPage), total
    });
  });
};

function getUnviewedMessages(req, res) {
  var userId = req.user.sub;
    Message.count({receiver: new ObjectId(userId), viewed: {'$ne': 'true'}}).exec()
    .catch((err) => {
      return res.status(500).send({message: 'error getUnviewedMessages = '+err});
    }).then((count) => {
      res.status(200).send({
          message: 'success',
          unviewed: count
      });
    })
};

function setViewedMessage(req, res) {
  var userId = req.user.sub;
  var params = req.body;

  Message.update({receiver:userId, viewed:{'$ne': 'true'}}, {viewed:'true'}, {multi:true}).exec()
  .catch((err) => {
    return res.status(500).send({message: 'error setViewedMessage = '+err});
  }).then((messageUpdated) => {
    res.status(200).send({
      message: 'success',
      messageUpdated
    });
  });
};

function home(req, res) {
  var params = req.body;
  res.status(200).send({message: 'Home message'});
};

module.exports = {
  home,
  saveMessage,
  getReceivedMessages,
  getEmmitMessages,
  getUnviewedMessages,
  setViewedMessage
}
