const { isEmail } = require('./validation');

// test case는 명령형으로 쓰기

test('닉네임은 최소 3자 이상이며 알파벳 대소문자(a~z, A~Z), 숫자(0~9)를 포함시켜야한다.', () => {
    expect(isEmail('Ab1')).toEqual(true);
    expect(isEmail('Ab')).toEqual(false);
    expect(isEmail('1b')).toEqual(false);

});

test('비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패한다.', () => {
    expect(isEmail('pa12')).toEqual(true);
    expect(isEmail('1a2')).toEqual(false);
    expect(isEmail('nickname12')).toEqual(false);
});

test('비밀번호 확인은 비밀번호와 정확하게 일치해야 합니다.', () => {
    expect(isEmail('password1')).toEqual(true);
    expect(isEmail('wrongpw')).toEqual(false);
});

test('DB에 중복된 닉네임이 존재 시 "중복된 닉네임입니다." 라는 에러메세지 띄우기', () => {
    expect(isEmail('password1')).toEqual(true);
    expect(isEmail('wrongpw')).toEqual(false);
});
