// 게시글 DB 관리

const mongoose = require("mongoose");
// auto increment 호출 및 초기화
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;
const boardSchema = new Schema({
  boardId: {
    type: Number,
    required: true,
    unique: true,
    default: 0
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // author: {
  //   type: String,
  //   required: true
  // },
  date: {
    type: Date,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  // board_pw: {
  //   type: String,
  //   required: true
  // }
  // isModified: {
  //   type: String,
  //   default: false
  // },
  // modified_date: {
  //   type: Date
  // }

}, {collection: '', versionKey: false});



// 'board'라는 db 모델의 boardId를 1부터 1씩 증가한다.
boardSchema.plugin(autoIncrement.plugin, {
  model: 'board',
  field: 'boardId',
  startAt: 1, // 1부터 시작
  increment: 1  // 1씩 증가
})


// 모델로 만들어서 내보낸다.
module.exports = mongoose.model("board", boardSchema);