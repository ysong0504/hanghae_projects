
const queryString = window.location.search;     //
const urlParams = new URLSearchParams(queryString);
const boardId = urlParams.get("boardId");
 
let modify_check = urlParams.get("modify");
let article_status = ''
let board_pw = ''


$(document).ready(function () {
    get_detail()
    
})

// 날짜 포맷팅 함수
function getFormatDate(d) {
    let date = new Date(d);
    let year = date.getFullYear()
    // JS month는 0부터 시작하므로 +1 이 필요하다.
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}.${month}.${day}`   
}

// 삭제하기
function delete_post() {
    let check_pw = prompt('비밀번호를 입력해주세요.')
    // Case 1:: 만약 저장한 비밀번호가 맞다면 삭제을 진행한다.
    if (check_pw == board_pw) {
        var check = confirm('삭제..하실겁니까?')
        if (check != true) {
            alert('취소되었습니다.')
        } else {
            $.ajax({
                type: 'DELETE',
                url: `/api/delete/${boardId}`,
                data: {},
                success: function(response) {
                    if(response.result == 'success') {
                        alert('삭제되었습니다.')
                        window.location.href=`/`
                    }
                }           
            })
        }
    // Case 2:: 만약 비밀번호가 틀렸다며 alert 창을 출력한다.
    } else {
        alert('비밀번호가 틀렸습니다.')
    } 
} 

// 수정하기
function modify_post() { 
    // Case 01:: 값이 모두 입력되었는지 확인한다.
    let title = $('#title').val()
    let content = $('#content').val()
    if (title === '' || author === '') {
        alert('모두 입력해주세요!!')
        return
    } 

    // Case 01:: 수정이 완료되었다면 변경된 내용을 저장한다.
    if (modify_check == 'true') {
        $.ajax({
            type: 'POST',
            url: `/api/modify/${boardId}`,
            data: {
                title: title,
                content: content,
                // modified_date: Date.now(),                       
            },
            success: function (response) {
                if(response.result == 'success') {
                    alert('수정이 완료되었습니다!')
                    window.location.href=`detail?boardId=${boardId}`
                }
            }
        })
    // Case 02:: 수정 페이지로 이동하려면 아래와 같이 진행.
    } else {
         // 02_01. 비밀번호 체크
        let check_pw = prompt('비밀번호를 입력해주세요.')
        // 02_02. 비밀번호가 틀리다면 alert 창을 출력 후 추가 진행 X
        if (check_pw != board_pw) {
            alert('비밀번호가 틀렸습니다.')
        // 02_03. 비밀번호가 맞을 시 수정할 수 있는 페이지로 이동
        } else if (check_pw == board_pw && modify_check !='true') {
            alert('비밀번호 확인 완료!')
            window.location.href=`detail?boardId=${boardId}&modify=true`
        } 
    }
}

// 상세보기
function get_detail() {
    // modify_check
    //  - true: 수정 버튼 누른 후 수정가능한 상황
    //  - false: 수정 버튼 누르기 전 readonly만 가능

    if (modify_check == 'true') {
        article_status = 'abled'
    } else {
        article_status = 'disabled'
    }
    
    $.ajax({
        type: 'GET',
        url: `/api/detail/${boardId}`,
        data: {},
        success: function (response) {
            let detail = response['board']
            board_pw = detail['board_pw']

            // 제목 & 작성자 출력
            $('#title_and_author').append(`<h1><input id='title' value="${detail['title']}" type='text' placeholder='제목' ${article_status}></input></h1>                                              
                                            <h5><input id='author' value='${detail['author']}' placeholder='작성자명' disabled></input></h5>`)               
            // 날짜 출력
            $('#date').append(`${getFormatDate(detail['date'])}`)
                                            // 내용 출력
            $('#content_detail').append(`<h5><textarea id='content' ${article_status}>${detail['content']}</textarea></h5>`)                          
            // 수정 페이지에서는 '저장하기' 버튼만 출력
            if (modify_check == 'true') {
                $('#btn').append(` <button id=password-1 onclick='modify_post()' type="button" class="btn btn-outline-warning">저장하기</button>`)
                $('#background').css('background-color','#FCFCEE')              


            // 상세 페이지에서는 '수정하기', '삭제하기' 버튼 출력
            } else {
                $('#btn').append(` <button id='password-1' onclick='modify_post()' type="button" class="btn btn-outline-secondary">수정하기</button>
                                    <button onclick='delete_post()' type="button" class="btn btn-outline-secondary">삭제하기</button>`)
            }        
        }
    })
}
