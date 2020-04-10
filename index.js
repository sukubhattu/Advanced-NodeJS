const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
// Initialize app
const app = express();

// For Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Initialize database
mongoose.connect('mongodb://localhost:27017/node', { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
// Check errors
db.on('error', (err) => {
	console.log(err);
});
// Check connection
db.once('open', () => {
	console.log('connected to mongodb');
});

// Expression Session Middleware
app.use(
	session({
		secret: 'my secret',
		resave: true,
		saveUninitialized: true,
		cookie: { secure: true }
	})
);
app.use(flash());
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next) {
	// if there's a flash message in the session request, make it available in the response, then delete it
	res.locals.sessionFlash = req.session.sessionFlash;
	delete req.session.sessionFlash;
	next();
});
// Express-messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// Express Validator Middleware
app.use(
	expressValidator({
		errorFormatter: function(param, msg, value) {
			var namespace = param.split('.'),
				root = namespace.shift(),
				formParam = root;

			while (namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);
app.use('/articles', require('./routes/articles'));
app.use('/users', require('./routes/users'));

// Initialize server
const port = process.env.port || 3000;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
