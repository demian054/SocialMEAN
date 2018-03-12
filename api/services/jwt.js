'use strict'
//import { GLOBAL } from './global';


var jwt = require('jwt-simple');
var moment = require('moment');

var secretWord = 'secretWord';

//export var SECRET = 'clave_secreta';


exports.createToken = function(user){
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };
  //console.log({"sec":this.SECRET});
  return jwt.encode(payload, secretWord);

};
