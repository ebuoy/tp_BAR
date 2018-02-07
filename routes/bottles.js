'use strict'

const Express = require('express');
const Joi = require('joi');
const Celebrate = require('celebrate');

const DB = require('../db.js');
const Passport = require('passport');

const router = Express.Router();

router.get('/bottles',(req,res,next)=>{

	console.log('GET /bottles');
	DB.all('SELECT * FROM BOTTLES',(err,data)=>{

        if (err) {
            return next(err);
        }
        return res.json(data);
	});
});

router.get('/bottles/:id', (req, res, next) => {

    DB.get('SELECT * FROM BOTTLES WHERE ID = ?', [req.params.id], (err, data) => {

        if (err) {
            return next(err);
        }
        return res.json(data);
    });
});

router.post('/bottles',Passport.authenticate('basic',{session:false}),
	Celebrate.celebrate(
    {
        	body: Joi.object().keys({
	            brand: Joi.string().required(),
	            price: Joi.number().required(),
	            volume: Joi.number().integer().required(),
	            count: Joi.number().integer().required()
        	})
    }),
    (req,res,next)=>{

		if(req.user.ROLE!=='ADMIN'){
			res.status(401);
			res.end('Unauthorized');
		};

		console.log('INSERT new bottle by ' + req.user.NAME);
        DB.run('INSERT INTO BOTTLES (BRAND,PRICE,VOLUME,COUNT) VALUES (?,?,?,?)', [req.body.brand, req.body.price,req.body.volume,req.body.count], (err) => {

            if (err) {
                return next(err);
            }
            res.status(201);
            res.end();
		});
	});

router.patch('/bottles/:id',Passport.authenticate('basic',{session:false}),
	Celebrate.celebrate(
    {
        	body: Joi.object().keys({
	            count: Joi.number().integer().required()
        	})
    }),
    (req,res,next)=>{

		console.log('UPDATE bottle by ' + req.user.NAME);
        DB.run('UPDATE BOTTLES SET COUNT=?', [req.body.count], (err) => {

            if (err) {
                return next(err);
            }
            res.status(201);
            res.end();
		});
	});

router.delete('/bottles',Passport.authenticate('basic',{session:false}),

	Celebrate.celebrate(
    {
        	body: Joi.object().keys({
	            brand: Joi.string().required()
        	})
    }),
    (req,res,next)=>{
		if(req.user.ROLE!=='ADMIN'){
			res.status(401);
			res.end('Unauthorized');
		};
		console.log('DELETE bottle by ' + req.user.NAME);
        DB.run('DELETE FROM BOTTLES WHERE BRAND=?', [req.body.brand], (err) => {

            if (err) {
                return next(err);
            }
            res.status(201);
            res.end();
		});
	});

module.exports.router=router;