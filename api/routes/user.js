'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

api.get('/homeUser', UserController.home);
api.get('/homeUserAuth', mdAuth.ensureAuth, UserController.home);
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser);
api.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/update-file-user/:id', [mdAuth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);


//api.get('/pruebas-del-controlador', mdAuth.ensureAuth, UserController.pruebas);
//api.post('/register', UserController.saveUser);
//api.post('/login', UserController.login);



//api.get('/keepers', UserController.getKeepers);

module.exports = api;
