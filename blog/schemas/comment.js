// 게시글 DB 관리

const mongoose = require("mongoose");
// auto increment 호출 및 초기화
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;
const commentSchema = new Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true,
    default: 0
  },
  userId: {
    type: String,
    required: true
  },
  boardId: {
    type: Number,
    required: true
  },
  comment_content: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }

}, {collection: '', versionKey: false});



// 'board'라는 db 모델의 boardId를 1부터 1씩 증가한다.
commentSchema.plugin(autoIncrement.plugin, {
  model: 'comment',
  field: 'commentId',
  startAt: 1, // 1부터 시작
  increment: 1  // 1씩 증가
})


// 모델로 만들어서 내보낸다.
module.exports = mongoose.model("comment", commentSchema);