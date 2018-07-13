
var _bAjax = false;

function regexcheck(){ // ID Email  유효성 체크 함수

    var idandemail = $('#userEmail').val();

    var regex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if ($("#userEmail").val() == "") {
        alert("로그인 이메일을 입력해주세요");
        $("#userEmail").focus();
    } else if ($("#userPass").val() == "") {
        alert("로그인 비밀번호를 입력해주세요");
        $("#userPass").focus();
    } else {
        if(!regex.test(idandemail)){ // email 유효성 체크에 통과하지 못했으므로 ID 로그인으로..
            alert("Email 형식의 ID를 입력해주세요.");
            if (console) console.log("Email 형식이 아닌 ID");
            $.ajax({
                url: '/login/login/olduserlogin',
                data: $('#login input').serialize(),
                type: 'POST',
                dataType: 'json',
                beforeSend : function(xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                }
            }).done(function(responsedata){
                var error = responsedata.error;
                var msg = responsedata.message;
                var uvo = responsedata.data; // data안에 joinformVO가 담겨있다. 확인해보자
                if(error)
                    alert(msg);

                else{

                }
            });
        }
        else{ // Email 로그인
            if (console) console.log("Email Login for 2.0 UserController");
            emailLogin();
        }
    }
}

/**
 * @param result
 * @param result.isLogin
 * @param result.redirectUrl
 * @param result.message
 */
function emailLogin() {

    //if(_bAjax) return false;
    _bAjax = true;

     var userEmail = $(".user-data #userEmail").val();
     var userPass = $(".user-data #userPass").val();

    $.ajax({
        url: "/templateLogin",
        cache: false,
        type: "POST",
        async: false,
        data: {
            "userEmail": userEmail,
            "userPass": userPass
        },
        error: function () {
            _bAjax = false;
        },
        complete:_onLoadTemplateLogin
    }).done(function (result) {
        if(result.isLogin) {
            //location.href='/';
            var redirectUrl = $('#loginBtn').data('saveurl');
            location.href = redirectUrl.length < 1 ? '/' : redirectUrl;
        } else {
            console.log('Login FAIL');
            alert(result.message);
        }
    });
}

function _onLoadTemplateLogin(htResult) {
    _bAjax = false;
    if (htResult.status != 200) {
        //에러처리 하기.
        console.log('error');
        alert('');
        return false;
    }


}

function dologout(){
    $.ajax({
        url : '/signout',
        type : 'POST',
        dataType : 'json',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        }
    })
        .done(
            function(res) {
                var data = res.data;
                var error = res.error;

                location.href = '/login';

            });
}




/**
 * @param result
 * @param result.resultData
 * @param result.resultData.tempPassword
 * @param result.code
 * @param result.message
 *
 */
// Mail에서 사용
function checkEmail(e) {
    var emailPattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    if ($('#email').val() == "")
        alert("이메일을 입력해주세요.");
    else if (!emailPattern.test($('#email').val()))
        alert("이메일 형식으로 입력해주세요.");
    else {
        e.attr('onclick','alert("발송 처리중입니다.");');
        $.ajax({
            url : '/mail/sendingbefore',
            data : $('#email').serialize(),
            type : 'POST',
            dataType : 'json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
            }
        }).done(function(result) {
            var resError = result.code;
            var resData = result.resultData;
            var msg = result.message;

            if(resError == 1) {
                alert(msg);
            } else {
                $('#password').attr("value", resData.tempPassword);
                sendMail(e);
            }
        }).fail(function () {
            e.attr("onclick','alert('네트워크 에러가 발생되었습니다. 새로고침후 다시 시도해 주시기 바랍니다.');");
        });

    }

}

function sendMail(e) {
    $.ajax({
        url : '/mail/sending',
        data : $('#findPass input').serialize(),
        type : 'POST',
        dataType : 'json',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        }
    }).done(function(result) {
        e.attr('onclick','checkEmail($(this)); return false;');
        var msg = result.message;

        alert(msg);
    }).fail(function () {
        alert('네트워크 에러가 발생되었습니다. 새로고침후 다시 시도해 주시기 바랍니다.');
        e.attr("onclick','alert('네트워크 에러가 발생되었습니다. 새로고침후 다시 시도해 주시기 바랍니다.');");
    });
}