'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications'});

api.get('/homePublication', PublicationController.home);
api.get('/homePublicationAuth', mdAuth.ensureAuth, PublicationController.home);

api.post('/savePublication', mdAuth.ensureAuth, PublicationController.savePublication);
api.post('/update-file-pub', [mdAuth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/publications/:page?', mdAuth.ensureAuth, PublicationController.getPublications);
api.get('/getPublication/:id', mdAuth.ensureAuth, PublicationController.getPublication);
api.get('/get-image-pub/:id', mdAuth.ensureAuth, PublicationController.getImageFile);
api.delete('/publication/:id', mdAuth.ensureAuth, PublicationController.deletePublication);


/*api.get('/following/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowedUsers);
api.get('/getMyFollows/:followed?', mdAuth.ensureAuth, FollowController.getMyFollows);
api.post('/saveFollow', mdAuth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);*/

module.exports = api;
