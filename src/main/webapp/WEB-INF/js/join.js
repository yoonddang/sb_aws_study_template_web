
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
        url: ".template.ogin",
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








function joinCertify() {
    // checkBox control
    var all = $('.box_one').find('input');
    var agree = $('.box_two').find('input');

    all.on('click', function() {
        if($('.box_two').find('input:checked').length >= 3) {
            console.log('all - agree 3');
            agree.prop('checked', false) ;
            all.prop('checked', false) ;
        } else {
            console.log('all - agree < 3');
            agree.prop('checked', true) ;
            all.prop('checked', true) ;
        }
    });
    agree.on('click', function() {
        if($('.box_two').find('input:checked').length >= 3) {
            console.log('agree > 3');
            all.prop('checked', true) ;
        } else {
            console.log('agree < 3');
            all.prop('checked', false) ;
        }
    });

    // 동의 btn
    var checkBoxes = $('.box_two');
    $('#joinAgree').on('click',function () {
        if(checkBoxes.find('input:checked').length === 3) {
            // /join/create 호출 (post로 certify 값 true or 1 던짐)
            //alert('All check!');
            console.log('All check!');

            location.href='/join/form?certify=1&eventKey='+$(this).data('eventkey');
        } else {
            checkBoxes.find('input').each(function() {

                console.log($(this).data('value'));
                if(!$(this).prop('checked')) {
                    if($(this).data('value') == 1) {
                        alert("이용 약관에 동의 해주세요.");
                    }
                    if($(this).data('value') == 2) {
                        alert("개인정보 수집 및 이용에 동의 해주세요.");
                    }
                    if($(this).data('value') == 3) {
                        alert("위치정보 이용약관에 동의 해주세요.");
                    }
                    $(this).focus();
                    return false;
                }
            });
        }
    });

    // 취소 btn
    $('.btn-col-row').find('.ty6').on('click',function () {
        // 뒤로가기 기능이 있으면 될 듯 하다.
        // 일단 메인으로 보내버리자.
    });
}

var emailCheck, passwd1Check, passwd2Check, nicknameCheck, birthdayCheck, genderCheck, eventkeyCheck, areaCheck;
var emailDup, nicknameDup;
var emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
var passwdPattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,20}$/;
var nicknamePattern = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,6}$/;
function joinFormValidation() {
    if($('#joinWriteBox').length==1) {
        //이메일 유효성 체크
        $('#email').bind('focus keyup', function() {
            // 이메일 중복체크 값 초기화
            emailDup = 0;
            emailCheck = patternTest(emailPattern, "E-mail", $("#email"), $("#emailHelper"));
        });

        //닉네임 유효성 검사 시작.
        $('#nickname').bind('focus keyup', function() {
            // 닉네임 중복체크 값 초기화
            nicknameDup = 0;
            nicknameCheck = 0;
            var element = $("#nickname");
            var helper = $("#nicknameHelper");
            if(element.val().length < 2 || element.val().length > 6){
                helper.css("color","red");
                helper.text("닉네임은 2글자 이상 6글자 이하를 입력해야합니다.");
            }else{
                nicknameCheck = patternTest(nicknamePattern, "닉네임", element, helper);
            }
        });

        checkPassword();

        // 성별 체크
        $('[name="gender"]').click(function () {
            genderCheck = ($(":input:radio[name=gender]:checked").val() == null ? 0 : 1);
        });

        // 생년월일 체크
        setMonthDate();
        birthdayValidation();
        // email 중복 체크  버튼
        $('#emailDup').on('click',function () {
            checkEmailDuplication();
        });
        // nickname 중복 체크 버튼
        $('#nicknameDup').on('click',function () {
            checkNicknameDuplication();
        });

        // 추천인 코드 확인 버튼
        $('#eventKeyCheck').on('click',function () {
            checkEventKey();
        });
        // 가입 버튼
        $('#createUser').on('click',function () {
            console.log('check emailCheck : ' + emailCheck
                + 'check passwd1Check : ' + passwd1Check
                + 'check passwd2Check : ' + passwd2Check
                + 'check nicknameCheck : ' + nicknameCheck
                + 'check birthdayCheck : ' + birthdayCheck
                + 'check emailDup : ' + emailDup
                + 'check nicknameDup : ' + nicknameDup
                + 'check genderCheck : ' + genderCheck);
            createUser();
        });
    }

    if($('#changePwWriteBox').length==1) {
        checkPassword();
    }

    // 국가 및 지역 코드 선택 체크
    countryAreaListControl();
}

function checkPassword(){
    //비밀번호 유효성 검사 시작
    $('#password1').bind('focus keyup', function () {
        //비밀번호2 유효성 값 초기화
        passwd2Check = patternTest(passwdPattern, "비밀번호", $("#password2"), $("#passwordHelper2"));

        // 비밀번호 유효성 값 초기화
        var element = $("#password1");
        var element2 = $("#password2");
        var helper = $("#passwordHelper1");
        passwd1Check = 0;

        //비밀번호 길이 체크
        if (element.val().length < 8 || element.val().length > 20) {
            helper.css("color", "red");
            helper.text("비밀번호는 8자리 이상 20자리 이하입니다.");
            passwd1Check = 0;
        } else {
            //비밀번호2 값이 없으면
            if (element2.val() == "") {
                //유효성 체크
                passwd1Check = patternTest(passwdPattern, "비밀번호", element, helper);
            } else {
                //비밀번호2 값이 있고, 비밀번호1과 비밀번호2의 값이 같으면
                passwd1Check = patternTest(passwdPattern, "비밀번호", element, helper);
                helper = $("#passwordHelper2");  //비밀번호2 초기화
                passwd2Check = 0; //비밀번호2 확인값 초기화
                helper.css("color", "red");
                helper.text("비밀번호 확인을 해주세요.");
            }
        }

        if($('#changePwWriteBox').length==1) {
            helper = $("#passwordHelper1");
            if($("#password").val() === $("#password1").val()) {
                helper.css("color", "red");
                helper.text("현재 비밀번호와 다른 비밀번호를 입력 해주세요.");
                passwd1Check = 0;
                passwd2Check = 0;
            } else {
                helper.text = ' ';
            }
        }
    });

    //비밀번호 유효성 검사 시작
    $('#password2').bind('focus keyup', function() {
        // 비밀번호 유효성 값 초기화
        var element = $("#password1");
        var element2 = $("#password2");
        var helper = $("#passwordHelper2");
        passwd2Check = 0;
        //비밀번호1의 값이 비어있지 않고, 비밀번호1과 비밀번호2가 값이 같을 때
        if(element.val() != "" && element.val() === element2.val()) {
            helper.css("color","green");
            helper.text("비밀번호가 일치합니다.");
            passwd2Check = 1;
        } else {
            //아닐 때
            helper.css("color","red");
            helper.text("비밀번호 확인을 해주세요.");
            passwd2Check = 0;
        }
    });
}

function patternTest(pattern, name, element, helper){
    helper.css("color","red");
    var value = element.val();

    if (value == "") {
        // 입력이 없을 경우
        helper.text(name+"을 입력해주세요.");
        return 0;
    } else {
        // 입력이 있을 경우
        if (!pattern.test(value)) {
            // 올바르지 않은 형식
            helper.text("올바른 "+name+" 형식을 입력해주세요.");
            return 0;
        } else {
            // 올바른 형식
            helper.text("올바른 "+name+" 형식입니다.");
            helper.css("color","green");
            return 1;
        }
    }
}

function numkeyCheck(e) {
    var keyValue = event.keyCode;
    if( ((keyValue >= 48) && (keyValue <= 57)) ) {
        return true;
    }
    return false;
}

function setMonthDate() {
    var sMonth = 1; //month의 시작
    var strMonth = "";

    for (var i = sMonth; i <= 12; i++) { //month 12월까지

        if(i <10) { //9월까지는 앞에 형식을 위해 0을 붙인다.
            strMonth += "<option value="+"0"+i+">" + "0"+i + "</option>";
        }else { //나머지는 그대로 출력.
            strMonth += "<option value="+i+">" +i + "</option>";
        }
    }
    document.getElementById("month").innerHTML = strMonth;
}

function birthdayValidation() {
    $('#year').bind('focus keyup', function() {
        var day = $("#day").val()*1;
        var month =$("#month option:selected").text();
        var year = $("#year").val()*1;

        $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
        $("#birthdayHelper").css("color", "red");
        birthdayCheck = 0;
    });
    $('#month').bind('focus keyup', function() {
        var day = $("#day").val()*1;
        var month =$("#month option:selected").text();
        var year = $("#year").val()*1;

        $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
        $("#birthdayHelper").css("color", "red");
        birthdayCheck = 0;

    });

    $('#day').bind('focus keyup', function() {
        var day = $("#day").val()*1;
        var month =$("#month option:selected").text();
        var year = $("#year").val()*1;
        birthdayCheck = 0;

        //모두 입력했는지 검사.
        //year or day 가 입력이 되어있따면
        if(year != null && day != null ) {
            //year 검사
            //year가 옳다
            if(year > 1900 && year <2016) {
                //day검사
                //1,3,5,7,8,10.12 월달일때
                if(month == 01 ||month == 03 ||month == 05 ||month == 07 ||month == 08 ||month == 10 ||month == 12) {
                    //올바른 날짜이면 ok
                    if(day > 0 && day <= 31) {
                        $("#birthdayHelper").text("올바른 날짜 입니다.");
                        $("#birthdayHelper").css("color", "green");
                        birthdayCheck = 1;
                        $('#birthday').val(year+'-'+month+'-'+day);

                    }else{ //아니면 false
                        $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
                        $("#birthdayHelper").css("color", "red");
                        birthdayCheck = 0;
                    }
                }
                //2월달일 때.
                if(month == 02) {
                    //올바른 날짜면 ok
                    if(day > 0 && day <= 29) {
                        $("#birthdayHelper").text("올바른 날짜 입니다.");
                        $("#birthdayHelper").css("color", "green");
                        birthdayCheck = 1;
                        $('#birthday').val(year+'-'+month+'-'+day);
                        //아니면 false
                    }else{
                        $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
                        $("#birthdayHelper").css("color", "red");
                        birthdayCheck = 0;
                    }
                }
                if(month == 04 || month == 06 || month == 09 || month ==11) {
                    if(day >0 && day <= 30) {
                        $("#birthdayHelper").text("올바른 날짜 입니다.");
                        $("#birthdayHelper").css("color", "green");
                        birthdayCheck = 1;
                        $('#birthday').val(year+'-'+month+'-'+day);
                    }else{
                        $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
                        $("#birthdayHelper").css("color", "red");
                        birthdayCheck = 0;
                    }
                }
            }else {
                $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
                $("#birthdayHelper").css("color", "red");
                birthdayCheck = 0;
            }
        }else{
            $("#birthdayHelper").text("올바른 날짜를 입력 해주세요.");
            $("#birthdayHelper").css("color", "red");
            birthdayCheck = 0;
        }
    });
}

function countryAreaListControl() {
    // country
    if($('.country').length==0){return;}
    $('#country_select').change(function() {
        var country = $("#country_select option:selected").val();
        console.log(country);
        $('#country_idx').val(country);

        if (country === "82") {
            $('#sel-dosigu').show();
        } else {
            if(country === "0") {
                areaCheck = 0;
            } else {
                areaCheck = 1;
            }
            $('#sel-dosigu').hide();
            //TODO 도시군구값을 다 지워야한다.
            $('#area_idx').val(0);
        }
    });

    /**
     * @param result
     * @param result.resultData
     * @param result.resultData.areaList[].foo
     * @param result.resultData.areaList.area_idx
     * @param result.resultData.areaList.area_sigu
     */
    $('#area_do').change(function() {
        var doIdx = $("#area_do option:selected").val();
        console.log(doIdx);

        $.get('/join/getAreaList?doIdx='+doIdx).done(function (result){
            var resultList = result.resultData.areaList;
            var resError = result.code;
            var resMsg = result.message;

            if(resError == 1)
                alert('다시 시도해 주시기 바랍니다.');
            else{
                $('#area_sigu').empty();
                var option = $("<option value='0'>선택하세요</option>");
                $('#area_sigu').append(option);
                for ( var i in resultList){
                    option = $("<option value='"+resultList[i].area_idx+"'>"+resultList[i].area_sigu+"</option>");
                    $('#area_sigu').append(option);
                }
            }
        });
    });

    $('#area_sigu').change(function() {
        var area_sigu = $("#area_sigu option:selected").val();
        console.log(area_sigu);
        $('#area_idx').val(area_sigu);
        areaCheck = 1;
    });

}

function checkEmailDuplication() {
    var email = $('#email').val();
    if(emailCheck != 1) {
        alert('올바른 E-mail을 입력해 주세요.');
    } else {
        console.log('email Check Start: '+email);
        $.ajax({
            url : '/join/checkEmailDuplication',
            data : $('#email').serialize(),
            type : 'POST',
            dataType : 'json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
            }
        }).done(function(res){
            var resData = res.resultData;
            var resError = res.code;
            var resMsg = res.message;

            if(resError == 1)
                alert(resMsg);
            else{
                alert(resMsg);
                emailDup = 1;
            }
        });
    }
}

function checkNicknameDuplication() {
    var nickname = $('#nickname').val();
    if(nicknameCheck != 1) {
        alert('올바른 닉네임을 입력해 주세요.');
    } else {
        console.log('nickname Check Start: '+nickname);
        $.ajax({
            url : '/join/checkNicknameDuplication',
            data : $('#nickname').serialize(),
            type : 'POST',
            dataType : 'json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
            }
        }).done(function(res){
            var resData = res.resultData;
            var resError = res.code;
            var resMsg = res.message;

            if(resError == 1)
                alert(resMsg);
            else{
                alert(resMsg);
                nicknameDup = 1;
            }
        });
    }
}

function checkEventKey() {
    var eventKey = $('#event_key').val();
    if(eventKey == "")
        alert("추천인 코드를 입력해주세요.");
    else{
        eventkeyCheck = 0;
        console.log('eventKey Check Start: '+eventkeyCheck+'eventKey : '+eventKey);
        $.ajax({
            url : '/join/checkEventkey',
            data : $('#event_key').serialize(),
            type : 'POST',
            dataType : 'json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
            }
        }).done(function(res){
            var resData = res.resultData;
            var resError = res.code;
            var resMsg = res.message;

            if(resError == 1)
                alert(resMsg);
            else{
                alert(resMsg);
                eventkeyCheck = 1;
            }
        });
    }
}

function createUser() {
    // 회원가입 양식 데이터 유효성 체크
    if (emailDup != 1) {
        alert("E-mail 중복체크를 해주세요.");
    } else if (nicknameDup != 1) {
        alert("닉네임 중복체크를 해주세요.");
    } else if (passwd1Check != 1 || passwd2Check != 1) {
        alert("비밀번호를 확인해주세요.");
    } else if (genderCheck != 1) {
        alert("성별을 입력해주세요.");
    } else if (birthdayCheck != 1) {
        alert("생년월일을 입력해주세요.");
    } else if (areaCheck != 1) {
        alert("국가 또는 지역을 선택해주세요.")
    } else if (eventkeyCheck != 1 && $('#event_key').val() != "") {
        // eventKey가 존재 하면서 체크가 안된 경우만, eventKey가 존재 안하면 그냥 패스~
        alert("추천인 확인을 눌러주세요.");
    } else {
        console.log($('#formData input').serialize());
        $.ajax({
            url: '/join/create',
            data: $('#formData input').serialize(),
            type: 'POST',
            dataType: 'json',
            /*contentType: "application/json; charset=UTF-8",*/
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json");

                xhr.setRequestHeader("contentType", "application/json; charset=UTF-8");
            }
        }).done(function(res){
            var resData = res.resultData;
            var resError = res.code;
            var resMsg = res.message;

            if(resError == 1)
                // 실패
                alert(resMsg);
            else{
                // 성공
                location.href = "/join/result";
            }
        });
    }
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