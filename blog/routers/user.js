// 클라이언트에서 요청별로 로직이 구현되는 곳
const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Joi를 이용한 회원가입 Validation 확인
const postUserSchema = Joi.object({
  userId: Joi.string()
    .regex(/(?=.*\d)(?=.*[a-z])/)
    .min(3)
    .required(),
  nickname: Joi.string().min(1).required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().required(),
});

// 회원가입
router.post('/users', async (req, res) => {
  try {
    const { userId, nickname, password, confirmPassword } =
      await postUserSchema.validateAsync(req.body);

    // Case 0. 비밀번호에 닉네임이 포함되어 있는 지 확인
    if (password.includes(userId)) {
      // 400 - bad request
      res.status(400).send({
        errorMessage: '비밀번호 안에 닉네임을 포함시키면 안돼요!',
      });
      return;
    }

    // Case 1. 비밀번호와 비밀번호 확인 입력값이 다를 시
    if (password != confirmPassword) {
      // 400 보다 낮은 값은 클라이언트에서 성공으로 받아들인다.
      // 400 - bad request
      res.status(400).send({
        errorMessage: '비밀번호..동일하게 적어줘',
      });
      return;
    }

    // Case 2. 이미 동일한 닉네임이 DB에 있을 시
    const isExist = await User.findOne({
      $or: [{ nickname }, { userId }],
    }).exec();
    if (isExist) {
      res.status(400).send({
        errorMessage: '이미 동일한 아이디 또는 닉네임이 있습니다.',
      });
      return;
    }

    // Case 3. 회원가입 성공 시 DB에 저장
    const user = new User({ userId, nickname, password });
    await user.save();

    res.status(201).send({ result: 'success' });
  } catch (err) {
    res.status(400).send({
      errorMessage: '데이터 형식이 틀렸습니다. 다시 시도해주세욧!',
    });
  }
});

// Joi를 이용한 로그인 Validation 확인
const postUserAuth = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

// 로그인 (성공 시 토큰 발급)
router.post('/auth', async (req, res) => {
  try {
    const { userId, password } = await postUserAuth.validateAsync(req.body);

    // Case 1. 입력한 닉네임 또는 비밀번호가 다를 시
    const user = await User.findOne({
      $and: [{ userId }, { password }],
    });
    if (!user) {
      // 401 : 인증실패
      res.status(401).send({
        errorMessage: '닉네임 또는 패스워드가 잘못됐습니다.',
      });
      return;
    }

    // Case 2. 로그인 성공 시 Id 값을 value로 한 토큰을 발급한다
    const token = jwt.sign(
      { userId: user.userId },
      'fairy-seunghyunkim-not-the-tutor-but-my-bf'
    );
    // 쿠키를 이용하여 사용자 정보를 저장한다.
    if (req.cookies['userId'] == undefined) {
      res.cookie('userId', user.userId, {});
    }
    res.json({ result: token });
  } catch (err) {
    res.status(400).send({
      errorMessage: '데이터 형식이 틀렸습니다. 다시 시도햇죠!!',
    });
  }
});

// 쿠키 제거
router.post('/logout', async (req, res) => {
  res.clearCookie('userId');
  res.send({ result: 'success' });
});

// 생성한 모듈 밖으로 내보내기
module.exports = router;
