// 게시글 DB 관리

const mongoose = require("mongoose");
// auto increment 호출 및 초기화
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;
const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
}, {collection: '', versionKey: false});


// // 'board'라는 db 모델의 boardId를 1부터 1씩 증가한다.
// userSchema.plugin(autoIncrement.plugin, {
//   model: 'user',
//   field: 'userId',
//   startAt: 1, // 1부터 시작
//   increment: 1  // 1씩 증가
// })


// 모델로 만들어서 내보낸다.
module.exports = mongoose.model("user", userSchema);