const express = require('express');
const router = express.Router();
// Bring up the models
let Article = require('../Models/Article');
// creating a view
// GET
router.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		// console.log(articles);
		if (err) {
			console.log(err);
		} else {
			// if no error
			// storing that query into another list
			const articlesCopy = {
				articles: articles.map((eachArticle) => {
					return {
						id: eachArticle.id,
						title: eachArticle.title,
						author: eachArticle.author,
						body: eachArticle.body
					};
				})
			};
			res.render('articles', {
				title: 'Articles',
				articles: articlesCopy.articles
			});
		}
	});
});

// Fuck to make POST url you have to make GET url
// let's get started with get url
router.get('/add', (req, res) => {
	res.render('add_article', {
		title: 'Add Article'
	});
});
// POST method
router.post('/add', (req, res) => {
	// Valdidators
	req.checkBody('title', 'title is required').notEmpty();
	req.checkBody('author', 'author is required').notEmpty();
	req.checkBody('body', 'body is required').notEmpty();
	// Get errors
	let errors = req.validationErrors();
	if (errors) {
		res.render('add_article', {
			title: 'Add Article',
			errors: errors
		});
	} else {
		// let's grab data from form
		let article = new Article();
		article.title = req.body.title;
		article.author = req.body.author;
		article.body = req.body.body;
		// save this example
		article.save((err) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/articles');
			}
		});
	}
});
// GET single article
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			console.log(err);
		} else {
			let articleCopy = {};
			articleCopy.id = article._id;
			articleCopy.title = article.title;
			articleCopy.author = article.author;
			articleCopy.body = article.body;
			res.render('article_detail', {
				title: 'Article Detail',
				article: articleCopy
			});
		}
	});
});

// Update Route GET
// Update is similar to get single object
// passing that single item so that
// the original value is added to the form
router.get('/:id/edit/', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			console.log(err);
		} else {
			let articleCopy = {};
			articleCopy.id = article._id;
			articleCopy.title = article.title;
			articleCopy.author = article.author;
			articleCopy.body = article.body;
			res.render('article_update', {
				title: 'Update Article',
				article: articleCopy
			});
		}
	});
});

// update Route POST
router.post('/:id/edit', (req, res) => {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	// finding the article to update
	let query = { _id: req.params.id };

	Article.update(query, article, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/articles/' + req.params.id);
		}
	});
});

// DELETE
router.get('/:id/delete', (req, res) => {
	Article.findByIdAndRemove(req.params.id, (err, article) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/articles');
		}
	});
});

module.exports = router;
