
var ws = null;
var nick_name = '';
ws_open();


function ws_open(){
    nick_name= $('.nick').html();
    ws = new WebSocket("ws://localhost/chat/"+nick_name);

    //웹소켓 켜기
    ws.onopen = function (evt){
        console.log("웹소켓 연결됨");
    }

    //웹소켓 끊겼을 때
    ws.onclose = function(evt){
        console.log('웹소켓 종료',evt);
        console.log('웹소켓 종료 이유',evt.reason);
    }

    //웹소켓 도착한 메시지
    ws.onmessage = function(evt){
        var data= JSON.parse(evt.data);
        console.log("받은 메시지 : ", data);

        var content ='';
        if(data.nick === nick_name){
            console.log('내가 보낸 메시지');
            content = '<div class="chat_msg_box chat_msg_box_mine"><div class="chat_msg_mine">'+data.content+'</div><div class="chat_time">'+data.date+'</div></div>';

        }else if(data.nick === 'system'){
            console.log('시스템이 보낸 메시지');
            content = '<div class="chat_system_alert">'+data.content+'</div>';


        }else{
            console.log('다른 사람이 보낸 메시지');
            content = '<div class="chat_msg_box chat_msg_box_other"><div class="chat_msg_other_name">'+data.nick+'</div><div class="chat_msg_other">'+data.content+'</div><div class="chat_time">'+data.date+'</div></div>';

        }

        $('.chat_msg_list').append(content);

    }

}

function send_chat(){
            console.log("메시지 보냄");
            var chat_msg= $('.chat_enter').val();
            var date = get_time();
            var chat_participant_list = $('.chat_group_participant').html();
            console.log('chat_participant_list',chat_participant_list);

            try {
                if (ws && ws.readyState === 1) {
                    console.log('웹소켓 켜짐');
                    ws.send(nick_name + '/' + chat_msg + '/' + date + '/' + chat_participant_list);
                    insert_chat_db(chat_msg, date);
                } else {
                    console.log('웹소켓 끊어짐');
                    ws_open();
                }
            } catch (e) {
                console.error('웹소켓 메시지 전송 실패:', e);
                ws_open();  // 메시지 전송 실패 시 재연결 시도
            }



}

function insert_chat_db(chat_msg, date){
    //db에 넣는 작업하기
    //그룹 idx
    var chat_grp_idx = $('.chat_group_entity_grp_idx').html();

    // 송신자 id (nick_name)
    // 내용(chat_msg)
    // 보낸 시간(date)
    $.ajax({
        type : 'GET',
        url : 'insert_chat.ajax',
        data : {'grp_idx': chat_grp_idx,'nick_name':nick_name,'chat_msg':chat_msg,'date':date},
        dataType : 'JSON',
        success : function(data){
            console.log("채팅 넣기 성공");
        },
        error : function(e){
            console.log(e);
        }

    });


}


function get_time(){
    let today = new Date(); //오늘 날짜에 대한 전체 정보

    let year = today.getFullYear();//년도 구하기
    let month = today.getMonth()+1;
    month = month.toString().padStart(2, '0'); //달 구하기 -> 1월 = 0,12월 = 11
    let date = today.getDate().toString().padStart(2, '0'); // 일 구하기

    let hours = today.getHours().toString().padStart(2, '0');
    let minutes = today.getMinutes().toString().padStart(2, '0');
    let seconds = today.getSeconds().toString().padStart(2, '0');

    //format
    var do_date= year+'-'+month+'-'+date+ ' ' + hours+':'+minutes+':'+seconds;
    console.log("일자:",do_date);
    return do_date;
}