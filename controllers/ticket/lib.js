const Ticket = require('../../schema/schemaTicket.js');
const { CLIEngine } = require('eslint');
const mongoose = require('mongoose')

function create(req, res) {
	if (!req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request"
		})
	} else {
		console.log(req.user)
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			priority: req.body.priority,
			creatorEmail: req.user.email,
			comments: {commentor: req.user.email, comment: "Ticket created"}
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": `Internal error ${err}`
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
			"text": "Invalid request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id,  function (err, result) {
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
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket, user: req.user});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": `Internal error ${error}`
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": `Internal error ${error}`
					})
			}
		})
	}
}

function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid request"
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
						"text": `Internal error ${error}`
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": `Internal error ${error}`
					})
			}
		})
	}
}

function update(req, res) {
	// console.log(req.body);
	if (!req.params.id || !req.body.description || !req.body.responsible || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request"
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
						"text": `Internal error ${error}`
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": `Internal error ${error}`
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
		})
	})

	findTicket.then(function (tickets) {
		res.status(200).render('ticket/index', {title: 'List of tickets', tickets, user: req.user});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": `Internal error ${error}`
				})
				break;
			case 200:
				res.status(200).json({
					"text": "There is no ticket yet"
				})
				break;
			default:
				res.status(500).json({
					"text": `Internal error ${error}`
				})
		}
	})
}

exports.commentPost =  (req, res, next) => {
	const { userEmail, ticketId, comment } = req.body
	// console.log(req.body)
	if ( !ticketId || !comment || !userEmail ) {
		res.status(400).json({
			"text": "Invalid request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			
			Ticket.findOne({_id: ticketId}, function (err, result) {

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
			ticket.comments.push({comment: comment, commentor: userEmail})
			ticket.save()
			// res.redirect(`../${ticket.getId()}`);

			res.status(200).redirect(`/ticket/${ticket.getId()}`);

		}, function (error) {
			switch (error) {
				case 500:
					console.log({
						"text": `Internal error 1 ${error}`
					})
					break;
				case 200:
					console.log({
						"text": "The ticket does not exist"
					})
					break;
				default:
					console.log({
						"text": `Internal error 2 ${error}`
					})
			}
		})
			}
	
	res.redirect('back');
}


exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;