// 클라이언트에서 요청별로 로직이 구현되는 곳
const express = require("express");
const router = express.Router();
//db 호출
const board = require("../schemas/board");


// 게시글 리스트 출력 (제목, 작성자명, 작성날짜, 정렬: 날짜기준 내림차순)
// 왜 views api와 아래 url를 매치안해주면 호출 조차 안될까?
router.get('/list', async(req, res) => {
    // schema에서 생성한 board db find 진행
    const lists = await board.find({}, {_id: 0}).sort({'date': -1})
    res.json({ lists: lists })
})

// 상세 페이지 출력
router.get('/detail/:boardId', async (req, res) => {
    const { boardId }  = req.params
    board_detail = await board.findOne({ boardId: boardId })
    // 조회수 증가
    board.updateOne({ boardId }, {'$inc': {'viewCount': 1}})
    res.json({ board: board_detail })
    
});

// 게시글 업로드
router.post('/upload', async(req, res) => {
    const { title, content, author, date, board_pw } = req.body
    await board.create({ title, content, author, date, board_pw })
    res.send({ result: "success" });
})

// 게시글 수정
router.post('/modify/:boardId', async(req, res) => {
    const { boardId }  = req.params
    // const boardId = req.params['boardId']
    const { title, content } = req.body

    board_modify = await board.updateOne({ boardId }, { $set: { title, content } })

    res.send({ result: "success" });
})

// 게시글 삭제
router.delete('/delete/:boardId', async(req, res) => {
    const { boardId } = req.params
    // 게시글이 존재하는지 확인
    const isExist = await board.find({ boardId })
    if (isExist.length > 0) {
        board_delete = await board.deleteOne({ boardId })
    }
    res.send({ result: "success" });

})



// 생성한 모듈 밖으로 내보내기
module.exports = router;

