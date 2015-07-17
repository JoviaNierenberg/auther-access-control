'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');


function isAuthenticated(req, res, next){
	//do something
	console.log(req.session)
	if (req.session.userId) return next();
	res.status(401).send('Must be logged in')
}

function isAdmin (req, res, next) {
    User.findById(req.session.userId).exec()
    .then(function (user) {
        if (req.user && req.user.isAdmin) next();
        else {
            var err = new Error('Forbidden');
            err.status = 403;
            throw err;
        }
    })
    .then(null, next);
}

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		else {
			req.requestedUser = user;
			next();
		}
	})
	.then(null, next);
});

router.get('/me', function(req,res,next){
	console.log('woo')
	console.log('req.session.userId: ', req.session.userId)
	User.findOne({_id:req.session.userId}).then(function (user){
		console.log(user)
		res.json(user)
	})
	.then(null, next);
})
router.get('/', function (req, res, next) {
	User.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories().then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id', isAuthenticated, isAdmin, function (req, res, next) {
	console.log('req.body', req.body);
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id', isAuthenticated, isAdmin, function (req, res, next) {
	req.requestedUser.remove()
	.then(function () {
		res.status(200).end();
	})
	.then(null, next);
});

module.exports = router;