// 클라이언트에서 요청별로 로직이 구현되는 곳
const express = require('express');
const router = express.Router();
//db 호출
const board = require('../schemas/board');
const User = require('../schemas/user');
const authMiddleware = require('../middlewares/auth-middleware');
// const cookieParser = require('cookie-parser');
function getUserIP(req) {
  const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return addr;
}

// 게시글 리스트 출력 (제목, 작성자명, 작성날짜, 정렬: 날짜기준 내림차순)
// 왜 views api와 아래 url를 매치안해주면 호출 조차 안될까?
router.get('/list', async (req, res) => {
  // schema에서 생성한 board db find 진행
  const lists = await board.find({}, { _id: 0 }).sort({ date: -1 });

  res.json({ lists: lists });
});

// 상세 페이지 출력
router.get('/detail/:boardId', async (req, res) => {
  const { boardId } = req.params;


  // 게시물 정보가져오기
  board_detail = await board.findOne({ boardId: boardId });

  // 작성자 닉네임 찾기
  const { nickname } = await User.findOne({ userId: board_detail.userId });
  // 조회수 올리기
  // 쿠키를 이용하여 조회수 중복을 방지해준다.
  if (req.cookies[boardId] == undefined) {
    res.cookie(boardId, getUserIP(req), {
      // 유효시간 : 12분
      maxAge: 720000,
    });
    // 조회수 증가 (await를 안붙히니까 안되었음 도대체왜!!!!)
    await board.updateOne({ boardId }, { $inc: { viewCount: 1 } });
  }

  // 현재 로그인된 계정의 정보 가져오기
  if (req.cookies['userId']) {
    currentUser = req.cookies['userId'];
  } else {
    currentUser = 'undefined'
  }
    res.json({
      board: board_detail,
      nickname: nickname,
      currentUser: currentUser,
    });
});

// 게시글 업로드 (로그인 유저만 사용 가능)
router.post('/upload', authMiddleware, async (req, res) => {
  const userId = res.locals.user.userId;
  const { title, content, date } = req.body;

  await board.create({ title, content, userId, date });
  res.send({ result: 'success' });
});

// 게시글 수정 (로그인 유저만 사용 가능)
router.post('/modify/:boardId', authMiddleware, async (req, res) => {
  const { boardId } = req.params;
  // const boardId = req.params['boardId']
  const { title, content } = req.body;

  board_modify = await board.updateOne(
    { boardId },
    { $set: { title, content } }
  );

  res.send({ result: 'success' });
});

// 게시글 삭제 (로그인 유저만 사용 가능)
router.delete('/delete/:boardId', authMiddleware, async (req, res) => {
  const { boardId } = req.params;
  // 게시글이 존재하는지 확인
  const isExist = await board.find({ boardId });
  if (isExist.length > 0) {
    board_delete = await board.deleteOne({ boardId });
  }
  res.send({ result: 'success' });
});

// 생성한 모듈 밖으로 내보내기
module.exports = router;
