'use strict'
const Express = require('express');
const router=Express.Router();
const DB=require('../db.js');

const Passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

Passport.use(new BasicStrategy((username,password,done)=>{

	DB.get('SELECT * FROM USERS WHERE NAME = ?',[username],(err,user)=>{
		if(err){
			return done(err);
		}
		if(!user){
			return done(null,false);
		}
		// Utiliser bcrypt sous npm pour hash les password
		if(user.PASSWORD === password){
			user.PASSWORD=undefined; // dans l'objet user, on n'a pas besoin du password, donc on l'enlève de l'objet quis sera disponible
			return done(null,user);
		}
		return done(null, false);

	});
}));


module.exports.router=router;