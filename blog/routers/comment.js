// 클라이언트에서 요청별로 로직이 구현되는 곳
const express = require("express");
const router = express.Router();
//db 호출
const comment = require("../schemas/comment");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 리스트 출력 (제목, 작성자명, 작성날짜, 정렬: 날짜기준 내림차순)
// 왜 views api와 아래 url를 매치안해주면 호출 조차 안될까?
router.get('/list', async(req, res) => {
    // schema에서 생성한 board db find 진행
    const lists = await board.find({}, {_id: 0}).sort({'date': -1})
    res.json({ lists: lists })
})

// 댓글 조회
router.get('/comment/:boardId', async(req, res) => {
    const { boardId } = req.params
    // 댓글 정보 가져오기
    const comments = await comment.find({ boardId: boardId },{}).sort({'date': -1}).exec()
    if (req.cookies['userId']) {
        currentUser = req.cookies['userId']
    }

    // 작성자 정보 가져오기
    const { nickname } = await User.findOne({ userId: comments.userId })


    res.json({
        lists: comments,
        nickname: nickname,
        currentUser: currentUser
    })
})

// 댓글 업로드 (로그인 유저만 사용 가능)
router.post('/comment', authMiddleware, async(req, res) => {
    const userId =  res.locals.user.userId
    const { comment_content, boardId } = req.body


    if (!comment_content) {
        res.status(400).send({
            errorMessage: '내용을 입력해주세요'
        })
        console.log('없음!')
        return
    }

    await comment.create({ comment_content, boardId, userId })
    res.send({ result: "success" });
})

// 댓글 삭제 (로그인 유저만 사용 가능)
router.delete('/comment/:commentId', authMiddleware, async(req, res) => {
    const { commentId } = req.params;

    isExist = await comment.findOne({ commentId: commentId })

    if (!isExist) {
        res.status(400).send({
            errorMessage: '존재하지 않는 게시물'
        })
        
        return;
    }

    await comment.deleteOne({ commentId: commentId })
    res.send({ result: "success" });
})

// 댓글 수정 (로그인 유저만 사용 가능)
router.patch('/comment', authMiddleware, async(req, res) => {

    const { content, commentId } = req.body;

    // 내용이 있는지 확인
    if (!content) {
        res.status(401).send({
            errorMessage: '내용을 입력해주세요.'
        })
        return;
    }

    // 기존 댓글이 db에 존재하는 지 확인
    isExist = await comment.findOne({ commentId: commentId })
    if (!isExist) {
        res.status(400).send({
            errorMessage: '존재하지 않는 게시물입니다.'
        })
        return;
    }

    await comment.updateOne({ commentId }, { $set: { comment_content: content }})
    res.send({ result: "success" });
})



// 생성한 모듈 밖으로 내보내기
module.exports = router;

