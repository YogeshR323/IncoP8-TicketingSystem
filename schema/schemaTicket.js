const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    }
},{ timestamps: { createdAt: 'created_at' }})

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
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    comment: {
        type: [commentSchema]  
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
},{ timestamps: { createdAt: 'created_at' }})


ticketSchema.methods = {
	getId: function () {
        return this.id;
    }
}

module.exports = mongoose.model('Ticket', ticketSchema);