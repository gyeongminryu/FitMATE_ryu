showSendButton(loginId, receiver);

function showSendButton(loginId, receiver) {
    if (loginId === receiver){
        document.getElementsByClassName('sendMessageBtn')[0].style.display = 'none';
    }
}


//개인 메시지 그룹 찾기
function find_chat_group(userId){
    $.ajax({
        type: 'post',
        url: 'member_find_chat_group.ajax',
        data: {
            'member2': userId
        },
        dataType: 'json',
        success: function(data) {
            console.log(data.group_idx);
        },
        error: function(e) {}
    });
}