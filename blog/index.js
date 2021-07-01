//express 연결
const express = require('express')
const app = express()
const port = 3000
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// templage engine 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//mongo db 연결
const connect = require('./schemas')
connect()

// 쿠키 parser 로딩 후 app에 등록
const cookieParser = require('cookie-parser');
app.use(cookieParser())

// 미들웨어 세팅
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// 이미지 동영상 등 정적파일을 제공해주는 미들웨어
app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
  next();
});


// router 객체 생성
const boardRouter = require('./routers/board')
app.use("/api", [boardRouter]);


app.get('/', (req, res) => {
  res.render('boardList') 
})


app.get('/detail', (req, res) => {
  res.render('boardDetail')
});

app.get('/upload', (req, res) => {
  res.render('boardUpload')
});
