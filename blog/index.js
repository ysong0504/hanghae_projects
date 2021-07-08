//express 연결
const express = require('express');
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

// templage engine 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//mongo db 연결
const connect = require('./schemas');
connect();

// 쿠키 parser 로딩 후 app에 등록
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// 미들웨어 세팅
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// 이미지 동영상 등 정적파일을 제공해주는 미들웨어
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
  next();
});

// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
//   throw err;
// });

// router 객체 생성
const boardRouter = require('./routers/board');
const userRouter = require('./routers/user');
const commentRouter = require('./routers/comment');
app.use('/api', [boardRouter]);
app.use('/api', [userRouter]);
app.use('/api', [commentRouter]);

app.get('/', (req, res) => {
  // 사용자 계정이 저장되어있는 쿠키 보내기
  if (req.cookies['userId']) {
    currentUser = req.cookies['userId'];
  } 
 
  if (typeof currentUser == 'undefined') {
    res.render('boardList')
  } else {
    res.render('boardList', { currentUser })
    console.log('index!!: ' + currentUser);
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/detail', (req, res) => {
  if (req.cookies['userId']) {
    currentUser = req.cookies['userId'];
  }
  // 현재 로그인된 유저의 정보를 넘겨준다.
  res.render('boardDetail');
});

app.get('/upload', (req, res) => {
  res.render('boardUpload');
});
