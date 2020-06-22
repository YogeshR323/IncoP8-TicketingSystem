let mongoose = require('mongoose')

let { Schema } = mongoose

const Comment = new Schema(
  {
    ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    
    userEmail: String,
    comment: String,

  },
  {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Math.floor(Date.now()) },
  }
)

module.exports = mongoose.model('Comment', Comment, 'commentTable')
