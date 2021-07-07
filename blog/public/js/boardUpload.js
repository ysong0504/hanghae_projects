// 날짜 포맷팅 함수
function getFormatDate(d) {
    let date = new Date(d);
    let year = date.getFullYear()
    // JS month는 0부터 시작하므로 +1 이 필요하다.
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}.${month}.${day}`   
}


function upload_post() { 
    // let password = prompt('수정, 삭제 시 사용할 수 있는 비밀번호를 입력해주세요. ')

    // if (password.match(/[^0-9]/g)) {
    //     alert("숫자만..입력해줘");
    //     return
    // }

    let title = $('#title').val()
    let author =  $('#author').val()
    let content = $('#content').val()

    if (title === '') {
        alert('제목을 입력해주세욧!')
    } else if (content === '') {
        alert('내용을 입력해주세욧!')
    } else {
        $.ajax({
        type: 'POST',
        url: `/api/upload`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
            date: Date.now(),
            title: title,
            // author: author,
            content: content,
            // board_pw: password     
        },
        success: function (response) {
            if (response['result'] == 'success') {
                window.location.href='/'
            }
        },
    })
}    
}
