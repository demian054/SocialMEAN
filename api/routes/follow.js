'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/follow'});

api.get('/homeFollow', FollowController.home);
api.get('/homeFollowAuth', mdAuth.ensureAuth, FollowController.home);
api.get('/following/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowedUsers);
api.get('/getMyFollows/:followed?', mdAuth.ensureAuth, FollowController.getMyFollows);
api.post('/saveFollow', mdAuth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);

module.exports = api;
