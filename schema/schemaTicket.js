const mongoose = require('mongoose');
let { Schema } = mongoose

var commentSchema = mongoose.Schema({
    commentor: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    }
},{ timestamps: { createdAt: true, updatedat: false }})

var ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
	description: {
		type: String,
		required: true
	},
	responsible: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: {
        type: [commentSchema]  
    },
    creatorEmail: {
        type: String,
        required: true
    },
},{ timestamps: { createdAt: 'created_at' }})


ticketSchema.methods = {
	getId: function () {
        return this.id;
    }
}

module.exports = mongoose.model('Ticket', ticketSchema);