const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
        type: String,
        required: true
	},
	isAdmin: {
		type: Boolean,
		required: true
	}
},{ timestamps: { createdAt: 'created_at' }})

userSchema.pre('save', function(next){
	this.password = bcrypt.hashSync(this.password, config.saltRounds);
	next();
});

userSchema.methods = {
	authenticate: function (password) {
		// return password === this.password;
		return bcrypt.compareSync(password, this.password);
	},
	getToken: function () {
		return jwt.sign({email: this.email}, config.secret, {expiresIn: '1d'});
	}
}

module.exports = mongoose.model('User', userSchema);