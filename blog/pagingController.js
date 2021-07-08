const board = require('../schemas/board');

export const pagingController = async (req, res) => {
  const { page } = req.query;
  try {
    // 총 게시물 개수 반환
    const totalPost = await board.countDocuments({});
    // 게시물이 없다면 강제 에러 발생
    if (!totalPost) {
      throw Error;
    }

    board_list = await board.findOne({}).sort({ date: -1 }).limit(maxPost);

    // 페이징에 필요한 변수들 할당
    let { startPage, endPage, hidePost, maxPost, totalPage, currentPage } =
      paging(page, totalPost);

    res.render('/', {
      board_list,
      currentPage,
      startPage,
      endPage,
      maxPost,
      totalPage,
    });
  } catch (error) {
    // 게시물이 없는 경우 빈 board 전달
    res.render('/', { board_list: [] });
  }
};

//paging 함수
const paging = (page, totalPost) => {};
