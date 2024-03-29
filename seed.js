'use strict';

var chance = require('chance')(123),
	_ = require('lodash'),
	Promise = require('bluebird');

var db = require('./server/db');
var User = require('./server/api/users/user.model');
var Story = require('./server/api/stories/story.model');

var numUsers = 100;
var numStories = 500;

var emails = chance.unique(chance.email, numUsers);

function randPhoto () {
	var g = chance.pick(['men', 'women']);
	var n = chance.natural({
		min: 0,
		max: 96
	});
	return 'http://api.randomuser.me/portraits/thumb/' + g + '/' + n + '.jpg'
}

function randAdmin (){
	var random = Math.random()*100
	if (random < 20) return true
		return false;
}

function randUser () {
	return new User({
		name: [chance.first(), chance.last()].join(' '),
		photo: randPhoto(),
		phone: chance.phone(),
		email: emails.pop(),
		password: chance.word(),
		isAdmin: randAdmin()
	});
}

function randTitle () {
	var numWords = chance.natural({
		min: 1,
		max: 8
	});
	return chance.sentence({words: numWords})
	.replace(/\b\w/g, function (m) {
		return m.toUpperCase();
	})
	.slice(0, -1);
}

function randStory (allUsers) {
	var user = chance.pick(allUsers);
	var numPars = chance.natural({
		min: 3,
		max: 20
	});
	return new Story({
		author: user,
		title: randTitle(),
		paragraphs: chance.n(chance.paragraph, numPars)
	});
}

function generateAll () {
	var users = _.times(numUsers, randUser);
	var stories = _.times(numStories, function () {
		return randStory(users);
	});
	return users.concat(stories);
}

function seed () {
	var docs = generateAll();
	return Promise.map(docs, function (doc) {
		return doc.save();
	});
}

db.drop = Promise.promisify(db.db.dropDatabase.bind(db.db));

db.on('open', function () {
	db.drop()
	.then(function () {
		return seed();
	})
	.then(function () {
		console.log('Seeding successful');
	}, function (err) {
		console.error('Error while seeding');
		console.error(err.stack);
	})
	.then(function () {
		process.exit();
	});
});