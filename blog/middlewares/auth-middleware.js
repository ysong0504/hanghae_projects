const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = function (req, res, next) {
  // 프런트엔드에서 헤더로 보낸 인증 값 확인
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');
  if (tokenType != 'Bearer') {
    res.status(401).send({
      errorMessage: '토큰타입이 틀리네 로그인 후 사용해라~',
    });
    return;
  }
  try {
    const { userId } = jwt.verify(
      tokenValue,
      'fairy-seunghyunkim-not-the-tutor-but-my-bf'
    );
    User.findOne({ userId }).then((user) => {
      // locals : express 에서 제공하는 저장공간
      // 해당 미들웨어를 사용하는 곳에서 공통적으로 사용 가능
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: '로그인 후 사용해라~',
    });
    // 만약 return을 안할 시 다음 미들웨어/라우터/핸들러가 호출된다구!
    return;
  }
};
