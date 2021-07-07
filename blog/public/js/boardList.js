
$(document).ready(function () {
    get_list()
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

function get_detail (boardId) {
    window.location.href ='/detail?boardId=' + boardId 
}

function auth_check() {
    if (localStorage.length > 0) {
        window.location.href="/upload"
    } else {
        const check = confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')
        if (check) {
            window.location.href="/login"
        } 
    }
}

function get_list() {
    console.log("리스트에서 값확인", localStorage.getItem('token'))

    $.ajax({
        type: 'GET',
        url: `/api/list`,
        data: {},
        success: function (response) {
            let lists = response['lists']
            for (post of lists) {              
                let temp_html = ` <tr class="table-light" style="align-content: center;" onclick=get_detail(${post['boardId']})>
                        <td class="table-light">${post['boardId']}</td> 
                        <td class="table-light">${post['title']}</td>
                        <td class="table-light">${post['userId']}</td>           
                        <td class="table-light">${getFormatDate(post['date'])}</td>
                        <td class="table-light">${post['viewCount']}</td>
                    </tr>`
                $('#boardList').append(temp_html)
            }
        }
    })
}
    

                

