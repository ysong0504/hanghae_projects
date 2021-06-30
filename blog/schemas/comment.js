// 댓글 DB 관리

const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  comment_pw: {
    type: Number,
    required: true
  }
}, {collection: '', versionKey: false});

// 모델로 만들어서 내보낸다.
module.exports = mongoose.model("comment", commentSchema);