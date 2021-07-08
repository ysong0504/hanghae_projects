// 게시글 DB 관리

const mongoose = require('mongoose');
// auto increment 호출 및 초기화
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const { Schema } = mongoose;
const userSchema = new Schema(
  {
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
      required: true,
    },
  },
  { collection: '', versionKey: false }
);


// 모델로 만들어서 내보낸다.
module.exports = mongoose.model('user', userSchema);
