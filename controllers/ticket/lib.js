const Ticket = require('../../schema/schemaTicket.js');
const { mongo, Mongoose } = require('mongoose');
const mongoose = require('mongoose')

function create(req, res) {
	if (!req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request; all fields needs to be filled"
		})
	} else {
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			priority: req.body.priority,
			creator: mongoose.Types.ObjectId(req.user._id)
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": "Internal error"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

function createForm(req, res) {
	res.status(200).render('ticket/create', {title: 'Create ticket', user: req.user});
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid request; no id passed"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			}).populate("creator", "email")
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket, user: req.user});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid request; no id passed"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/edit', {title: `Edit ticket n°${ticket._id}`, ticket, user: req.user});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function update(req, res) {
	console.log(req.body);
	if (!req.params.id || !req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request; not all fields filled"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;

			Ticket.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function list(req, res) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({}, function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		}).populate('creator', 'email').exec(
			function (err, tickets) {
				if (err) console.log(err)
				else  tickets.forEach( (ticket, index) => 
					console.log(ticket))
			})
	})


	findTicket.then(function (tickets) {
		// console.log(tickets)
		res.status(200).render('ticket/index', {title: 'List of tickets', tickets, user: req.user});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Internal error"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "There is no ticket yet"
				})
				break;
			default:
				res.status(500).json({
					"text": "Internal error"
				})
		}
	})
}

exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;