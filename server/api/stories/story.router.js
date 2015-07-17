'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var Story = require('./story.model');

router.param('id', function (req, res, next, id) {
	Story.findById(id).exec()
	.then(function (story) {
		if (!story) throw HttpError(404);
		else {
			req.story = story;
			next();
		}
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	Story.find({}).populate('author').exec()
	.then(function (storys) {
		res.json(storys);
	})
	.then(null, next);
});


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

router.post('/', isAuthenticated, function (req, res, next) {
	Story.create(req.body)
	.then(function (story) {
		return story.populateAsync('author');
	})
	.then(function (populated) {
		res.status(201).json(populated);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.story.populateAsync('author')
	.then(function (story) {
		res.json(story);
	})
	.then(null, next);
});

router.put('/:id', isAuthenticated, function (req, res, next) {
	_.extend(req.story, req.body);
	req.story.save()
	.then(function (story) {
		res.json(story);
	})
	.then(null, next);
});

router.delete('/:id', isAuthenticated, isAdmin, function (req, res, next) {
	req.story.remove()
	.then(function () {
		res.status(200).end();
	})
	.then(null, next);
});

module.exports = router;