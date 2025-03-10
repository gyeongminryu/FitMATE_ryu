// 모달
let alertCont = document.getElementsByClassName('modal_alert')[0],
    confirmCont = document.getElementsByClassName('modal_confirm')[0],
    msgstr = '',
    locationAddr = '';

const modal = {
    hide: function() {
        alertCont.style.display = 'none';
        confirmCont.style.display = 'none';
    },
    show: function(i) {
        document.getElementsByClassName('modal_body')[i].innerHTML = '<p>' + msgstr + '</p>';
        document.getElementsByClassName('backdrop')[i].addEventListener('click', modal.hide);
        document.getElementsByClassName('btn_close')[i].addEventListener('click', modal.hide);
        document.getElementsByClassName('btn_cancel')[i].addEventListener('click', modal.hide);
        document.getElementsByClassName('btn_confirm')[0].addEventListener('click', function() {
            location.href = locationAddr;
        });
    },
    showAlert: function(msg) {
        msgstr = msg;
        modal.show(0);
        alertCont.style.display = 'flex';
    },
    showConfirm: function(msg, loc) {
        msgstr = msg;
        locationAddr = loc;
        modal.show(1);
        confirmCont.style.display = 'flex';
    }
}

// ${msg} 값이 있을 경우 알림창 이벤트 발생
if (msg != ''){
    modal.showAlert(msg);
}