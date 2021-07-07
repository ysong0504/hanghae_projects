
const queryString = window.location.search;     //
const urlParams = new URLSearchParams(queryString);
const boardId = urlParams.get("boardId");
 
let modify_check = urlParams.get("modify");
let article_status = ''
let board_pw = ''


$(document).ready(function () {
    get_detail()
    get_comment()
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
    // Case 00:: 로그인 유무 검사
    if (localStorage.length == 0) {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        }
        return;
    } 

    const check = confirm('삭제..하실겁니까?')
    if (check != true) {
        alert('취소되었습니다.')
    } else {
        $.ajax({
            type: 'DELETE',
            url: `/api/delete/${boardId}`,
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            success: function(response) {
                if(response.result == 'success') {
                    alert('삭제되었습니다.')
                    window.location.href=`/`
                }
            }           
        })
    }
} 

// 수정하기
function modify_post() { 
    // Case 00:: 로그인 유무 검사
    if (localStorage.length == 0) {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        }
        return;
    } 

    // Case 01:: 값이 모두 입력되었는지 확인한다.
    let title = $('#title').val()
    let content = $('#content').val()
    if (title === '' || author === '') {
        alert('모두 입력해주세요!!')
        return
    } 

   // 수정이 가능한 페이지로 이동한다.
    if (modify_check != 'true') {
        window.location.href=`detail?boardId=${boardId}&modify=true`
    } else if (modify_check == 'true') {
        $.ajax({
            type: 'POST',
            url: `/api/modify/${boardId}`,
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
    } 

}

// 상세보기
function get_detail() {
    console.log("상세페이지에서 값확인", localStorage.getItem('token'))
    // modify_check
    //  - true: 수정 버튼 누른 후 수정가능한 상황
    //  - false: 수정 버튼 누르기 전 readonly만 가능

    if (modify_check == 'true' && localStorage.getItem('token') == null) {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        }
         return;
    }

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
            let nickname = response['nickname'];
            let currentUser = response['currentUser']
            let detail = response['board']
            board_pw = detail['board_pw']

            // 제목 & 작성자 출력
            $('#title_and_author').append(`<h1><input id='title' value="${detail['title']}" type='text' placeholder='제목' ${article_status}></input></h1>                                              
                                            <h5><input id='author' value='${nickname} (${detail['userId']})' placeholder='작성자명' disabled></input></h5>`)               
            // 날짜 출력
            $('#date').append(`${getFormatDate(detail['date'])}`)
                                            // 내용 출력
            $('#content_detail').append(`<h5><textarea id='content' ${article_status}>${detail['content']}</textarea></h5>`)                          
            
            
            // 현재 계정과 게시물 작성자가 동일할 시에만 삭제, 수정 버튼이 출력된다.
            if (currentUser == detail['userId']) {
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
        }
    })
}

// 댓글 조회하기
function get_comment() {
    $.ajax({
        type: 'GET',
        url: `/api/comment/${boardId}`,
        success: function (response) {
            let comments = response['lists']
            let currentUser = response['currentUser']
            let nickname = response['nickname']
            for(cont of comments) {
                console.log(cont['comment_content'])

                let temp_html=`<tr class="comment_list">                  
                                <td>${nickname} (${cont.userId})</td>
                                <td>${cont.comment_content}</td>
                                <td>${getFormatDate(cont.date)}</td>`

                // 현재 계정과 댓글 작성자가 동일할 시에만 삭제, 수정 버튼이 출력된다.
                if (currentUser == cont.userId) {
                    temp_html += ` <td>
                                        <button onclick="modify_comment( ${cont.commentId}, '${cont['comment_content']}' )" type="button" class="btn btn-outline-secondary">수정</button>
                                        <button onclick="delete_comment(${cont.commentId})" type="button" class="btn btn-outline-secondary">삭제</button>
                                    </td>
                                </tr>`
                } else {
                    temp_html += `<td></td></tr>`
                }
                
                $('#comment_list').append(temp_html)         
            }
        },
        error: function(status) {
            if(status == 400) {
                alert(response.responseJSON.errorMessage)
            }
        }
    })
}

// 댓글 달기
function upload_comment() {
    if (localStorage.length == 0) {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        }
        return; 
    }
    let content = $('#comment_content').val()

    if (content == '') {
        alert('내용을 입력해주세어!!')
        return;
    }

    $.ajax({
        type: 'POST',
        url: `/api/comment`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            comment_content:  content,
            boardId: boardId,
        },
        success: function (response) {
            if(response.result == 'success') {
                window.location.reload()
            }
        },
        error: function(response, status) {
            if(status == 400) {
                alert(response.responseJSON.errorMessage)
                location.reload()
            }
        }
    })
}
// 비로그인 사용자일 경우 댓글 창 클릭 시 알림창 띄우기
function check_auth() {
    if (localStorage.length == 0) {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        }
    }
} 

// 댓글 수정하기
function modify_comment(commentId, content) {
    $('#comment_list').hide();
    $('#comment_content').val(content);
    $('.comment_btn').empty();
    $('.comment_btn')
        .append(` <button id="upload_btn" type="button" onclick='upload_modified_comment(${commentId})' class="btn btn-secondary">수정하기</button>
                  <button id="upload_btn" type="button" onclick='window.location.reload()' class="btn btn-secondary">취소하기</button>
                `);
}

// 수정한 댓글 업로드하기
function upload_modified_comment(commentId) {
    let modified_content =  $('#comment_content').val();
    console.log(modified_content);
    if (modified_content == '') {
        alert('내용을 입력해주세어!!')
        return;
    }

    $.ajax({
        type: 'PATCH',
        url: `/api/comment`,
        data: {
            content: modified_content,
            commentId: commentId
        },
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        success: function(response) {
            if(response.result == 'success') {
                alert('댓글이 수정되었습니다.')
                window.location.reload()
            }
        },      
    })
}



// 댓글 삭제하기
function delete_comment(commentId) {
    console.log(commentId)
    const check = confirm('삭제..하실겁니까?')
    if (check != true) {
        alert('취소되었습니다.')
    } else {
        $.ajax({
            type: 'DELETE',
            url: `/api/comment/${commentId}`,
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            success: function(response) {
                if(response.result == 'success') {
                    alert('삭제되었습니다.')
                    window.location.reload();
                }
            },
            error: function(status) {
                if (status == 400) {
                    alert('존재하지 않는 게시물입니다.')
                }
            }         
        })
    }
} 


