'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secretWord = 'secretWord';


exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization) return res.status(403).send({ message: 'acceso negado'});
  var token = req.headers.authorization.replace(/['"]+/g, '');
  try {
    console.log({"sec":secretWord});
    var payload = jwt.decode(token, secretWord);
    if (payload.exp <= moment().unix()) return res.status(403).send({ message: 'Token espirado'});
  } catch (e) {
    //console.log("Error:", e);
    return res.status(404).send({ message: 'Token invalido'});
  }
  req.user = payload;
  next();
};
