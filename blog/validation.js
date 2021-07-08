// // 객체
// module.exports = {
//   // 함수 프로퍼티
//   isNickname: (value) => {
//         let arr =  value.split('')

//         // 최소 3자가 안될 시
//         if (arr.length < 3) {
//             return false;
//         } 

//         for (const word of arr) {
//             if (!/^[0-9a-zA-Z]$/gi.test(word)) {
//                 return false;
//             }
//         }
//     },

//     isPassword: (value) => {

//     }

//     let [localpart, domain, ...etc] = value.split('@');

//     if (value.includes(' ') || value.split('')[0] === '-') {
//       return false;
//     } else if (!localpart || !domain || etc.length) {
//       return false;
//     }

//     // 입력한 이메일 주소중, 로컬 파트(골뱅이 기준 앞부분)에는 영문 대소문자와 숫자,
//     // 특수문자는 덧셈기호(+), 하이픈(-), 언더바(_) 3개 외에 다른 값이 존재하면 이메일 형식이 아니다.
//     for (const word of localpart.split('')) {
//       if (!/^[0-9a-zA-Z+-_]$/gi.test(word)) {
//         return false;
//       }
//     }
//     // 입력한 이메일 주소중, 도메인(골뱅이 기준 뒷부분)에는
//     // 영문 대소문자와 숫자, 점(.), 하이픈(-) 외에 다른 값이 존재하면 이메일 형식이 아니다.
//     for (const word of domain.split('')) {
//       if (!/^[0-9a-zA-Z.-]$/gi.test(word)) {
//         return false;
//       }
//     }

//     return true;

//     //     let count = value.match(/@/g);
//     //    if(!count || count.length > 1) {
//     //        return false;
//     //    } else {
//     //        return true;
//     //    }
//     // return false;
//     // value가 이메일 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현해보세요
//   },









// }

