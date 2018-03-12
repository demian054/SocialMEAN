'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({ uploadDir: './uploads/users'});

api.get('/homeMessage', MessageController.home);
api.get('/homeMessageAuth', mdAuth.ensureAuth, MessageController.home);
api.get('/messages/:page?', mdAuth.ensureAuth, MessageController.getReceivedMessages);
api.get('/my-messages/:page?', mdAuth.ensureAuth, MessageController.getEmmitMessages);
api.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', mdAuth.ensureAuth, MessageController.setViewedMessage);
api.post('/message', mdAuth.ensureAuth, MessageController.saveMessage);


module.exports = api;
