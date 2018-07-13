function headerTopLoginBtn() {
    var loginBtn = $('.no-login-msg');
    if(loginBtn.length === 1) {
        loginBtn.attr('style','cursor:pointer;');
        loginBtn.on('click',function () {
            location.href='/login';
        });
    }
}

function loginCheck() {
    if(!$('#islogin').data('islogin')) {
        alert('로그인이 필요합니다.');
        location.href='/';
        return false;
    } else {
        return true;
    }
}

function mainBoardList() {
    if($('.m-notice').length == 0) {return ;}
    console.log('mainBoardList');
    loading(true);
    $.get('/board/main/1', function (data) {
        $('.m-notice').html(data);
    }).done(function () {
        loading(false);
    }).fail(function () {
        loading(false);
        console.log('fail');
    });
}

function  getReplyList(idx) {
    // 댓글 데이터 호출
    console.log('/reply/getReplyList?idx='+idx);
    loading(true);
    $.get('/reply/getReplyList?idx='+idx, function (data) {
        $('.comment-box').html(data);
    }).done(function () {
        loading(false);

        // 대댓글 조회는 별도의 버튼 클릭 이벤트 ajax 호출로 처리한다.
    }).fail(function () {
        loading(false);
        console.log('call reply fail');
    }).always(function () {
        replyBtnControl();
        comment();
    });
}

/**
 * @param res
 * @param res.resultData
 * @param res.code
 * @param res.message
 */
function replyBtnControl() {
    if($('.comment-box').length == 0) {return;}
    // 댓글 더보기 이벤트
    var replyListMoreBtn = $('#replyMoreBtn');
    replyListMoreBtn.on('click',function () {
        var url = '/reply/getReplyList?idx='+replyListMoreBtn.data("idx")+'&maxReorder='+replyListMoreBtn.data('maxreorder')+'&length='+replyListMoreBtn.data('length');
        console.log(url);
        loading(true);

        $.get(url, function (data) {
            $('.comment-box').html(data);
        }).done(function () {
            loading(false);
            // 대댓글 조회는 별도의 버튼 클릭 이벤트 ajax 호출로 처리한다.
        }).fail(function () {
            loading(false);
            console.log('fail');
        }).always(function () {
            rankingUi.reSet();
            replyBtnControl();
            targetFocus($('#replyMoreBtn'));
            comment();
        });
    });

    // 댓글 입력 이벤트
    var insertReplyBtn = $('#insertReplyBtn');
    insertReplyBtn.on('click',function () {
        console.log('insertReplyBtn');
        if(!$('#islogin').data('islogin')) {
            alert('로그인이 필요합니다.');
            return;
        }
        //loading(true);
        if($('#insertContent').val().length > 500) {
            return alert('500 자 ');
        }

        $.ajax({
            url: '/reply/insertReply',
            data: $('#replyInsertForm').serialize(),
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

            //loading(false);

            if(resError === 'FAIL') {
                // 실패
                alert(resMsg);
                console.log('fail');
            } else{
                // 성공
                console.log('ok');
                getReplyList($('#idx').val());
                targetFocus($('#replyMoreBtn'));
                //alert(resMsg);

            }
        });
    });

    // 댓글 수정 이벤트
    var updateReplyBtn = $('#updateReplyBtn');
    updateReplyBtn.on('click',function () {
        console.log('updateReplyBtn');
        //loading(true);

        $.ajax({
            url: '/reply/updateReply',
            data: $('#replyUpdateForm').serialize(),
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

            //loading(false);

            if(resError == 'FAIL') {
                // 실패
                alert(resMsg);
                console.log('fail');
            } else{
                // 성공
                console.log('ok');
                getReplyList($('#idx').val());
                targetFocus($('#replyMoreBtn'));
                //alert(resMsg);

            }
        });
    });

    // 댓글 삭제 이벤트
    var deleteReplyBtn = $('.fun-btn').find('[data-btn-act="delete"]');
    deleteReplyBtn.on('click',function () {
        console.log('deleteReplyBtn');
        //loading(true);
        var replyIdx = $('#reply_idx').val();
        var email = $('#updateEmail').val();

        $.get('/reply/deleteReply?replyIdx='+replyIdx+'&email='+email)
            .done(function (res) {
                var resData = res.resultData;
                var resError = res.code;
                var resMsg = res.message;

                //loading(false);

                if(resError == 'FAIL') {
                    // 실패
                    alert(resMsg);
                    console.log('fail');
                } else{
                    // 성공
                    console.log('ok');
                    getReplyList($('#idx').val());
                    //alert(resMsg);
                }
            }).fail(function () {
            //loading(false);
            console.log('fail');
        }).always(function () {
            targetFocus($('#replyMoreBtn'));
            rankingUi.reSet();
        });
    });

// 대댓글 조회 이벤트

// 대댓글 더보기 이벤트
}


function initBoard() {
    if($('.board-data-group').length > 0 || $('.awards-data-group').length > 0) {
        boardTitleControl();
        boardBtnControl();
    } else {
        return;
    }
    if($('.comment-box').length == 0){return;}
    getReplyList($('#boardIdx').val());
}

function boardTitleControl() {
    if($('#boardTitle').length < 1) { return;}
    var category = $('.bt-more-bar').data('category');
    var title = '';
    var engText = '';
    if(category == 1) {
        title = '다양한 소식을 확인하세요';
        engText = 'TEMPLATE</br>NOTICE';
    } else if(category == 2) {
        title = '확인하세요';
        engText = 'TEMPLATE</br>AND</br>EVENT';
    }
    $('#boardTitle').find('span').text(title);
    $('#boardTitle').parent().find('.eng-txt').html(engText);
}

function comment(){
    if($('.comment-list').length==0){return;}
    $('.reply-num .t-btn').off('click').on('click', function(){
        var target = $(this).parents('li').find('.reply-box');
        if(target.length==1){
            $(this).toggleClass('act');
            target.toggleClass('is-open');
        }
        return false;
    });
    var $modifyBt = $('.fun-btn').find('[data-btn-act="modify"]');
    $modifyBt.off('click').on('click', function(){
        $(this).parent().siblings('form').find('.subject').addClass('act-edit');
        return false;
    });
    var $replyClose = $('.reply-close-row a');
    $replyClose.off('click').on('click', function(){
        $replyClose.parents('.reply-box').removeClass('is-open');
        $replyClose.parents('li').find('.reply-num .t-btn').removeClass('act');
        return false;
    });
    var $replyFocusBtn = $('#replyFocus').on('click',function () {
        if($('#insertContent').length == 1) {
            targetFocus($('.comment-box'));
        }
    });
    var $replyCount = $('#replyCount');
    if($replyCount.length == 1) {

        $replyFocusBtn.parent().find('em').text(numberWithCommas($replyCount.text()));
    }

}

function targetFocus(e) {
    var scrollPosition = e.offset().top - 500;
    $('html, body').animate({
        scrollTop: scrollPosition
    }, 500);
}

function boardBtnControl() {
    // 게시글 쓰기 버튼
    insertBoardBtn();
    // 게시글 더보기 버튼
    boardMoreBtn();
    // 게시글 삭제 버튼
    deleteBoardBtn();
}

/**
 * 자유게시판 버튼 컨트롤
 *
 * @param res
 * @param res.resultData
 * @param res.code
 * @param res.message
 */
function insertBoardBtn() {
    // 게시글 입력 이벤트
    var insertBoardBtn = $('#insertBoardBtn');
    insertBoardBtn.on('click',function () {
        console.log('insertBoardBtn');
        if(!$('#islogin').data('islogin')) {
            alert('로그인이 필요합니다.');
            return;
        }
        //loading(true);
        if($('#content').val().length > 8000) {
            return alert('8000 자 ');
        }
        var chkInputValue = function (id, msg){
            if ( $.trim($(id).val()) == "") {
                alert(msg+" 입력해주세요.");
                $(id).focus();
                return false;
            }
            return true;
        }
        if ( ! chkInputValue("#writer", "작성자를")) return;
        if ( ! chkInputValue("#title", "글 제목을")) return;
        if ( ! chkInputValue("#content", "글 내용을")) return;

        $.ajax({
            url: '/board/save',
            data: $('#insertBoardForm').serialize(),
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

            //loading(false);

            if(resError === 'FAIL') {
                // 실패
                alert(resMsg);
                console.log('fail');
            } else{
                // 성공
                console.log('ok');
                //getReplyList($('#idx').val());
                //alert(resMsg);
                location.href = '/board/list/'+$('#category').val();
            }
        });
    });
}

/*
 * var limit = false;
 * defalut : data(count) = 10;
 *
 * !limit ?
 *   length = data(count) + 20;
 *   ajax
 *      var url = '/board/'+boardListMoreBtn.data("category")+'?length='+length;
 * .done
 *  result.count != 20 ?
 *      limit = true;
 *      append(result)
 *  data(count) = li.count
 *
 */
var limit = false;
var addNum = 20;
function boardMoreBtn() {
    if($('.board-more').length == 0) {return;}
    // 게시글 더보기 이벤트
    /**
     * @param resData.boardList[]
     * @param resData.boardCount
     * @param boardList[].category
     * @param boardList[].reg_ymdt
     * @param boardList[].board_idx
     * @param boardList[].title
     * @param boardList[].board_idx
     * @param boardList[].writer
     * @param boardList[].album_name
     * @param boardList[].sale_date
     * @param boardList[].distribute
     */
    var append = function (resData) {
        var boardList = resData.boardList;
        var boardCount = resData.boardCount;
        console.log('boardCount : '+boardCount);
        if(boardCount != 20) {
            limit = true;
        }
        var resultLi = '';
        var resultParent = $('#boardList');
        var permitTag;
        for ( var i in boardList) {
            if(boardListMoreBtn.data('category') == 6) {
                if(boardList[i].writer == boardListMoreBtn.data('user') || boardListMoreBtn.data('user') == '관리자') {
                    permitTag = '/board/one/'+boardListMoreBtn.data("category")+'?boardIdx='+boardList[i].board_idx;
                } else {
                    permitTag = '#" onclick="alert(\'접근 권한이 없습니다.\');';
                }
            } else {
                permitTag = '/board/one/'+boardListMoreBtn.data("category")+'?boardIdx='+boardList[i].board_idx;
            }
            resultLi += '<tr data-index="'+boardList[i].board_idx+'" data-category="'+boardList[i].category+'">';
                if(boardListMoreBtn.data('category') == 'schedule' || boardListMoreBtn.data('category') == 'newalbum') {
                    resultLi += '                            <td class="center">'+boardList[i].sale_date+'</td>' +
                    '                            <td><p>'+boardList[i].album_name+'</p></td>' +
                    '                            <td><p></p></td>' +
                    '                            <td><p></p></td>' +
                    '                            <td class="right">'+boardList[i].distribute+'</td>';
                } else {
                    resultLi += '                            <td class="center">'+boardList[i].reg_ymdt+'</td>' +
                        '                            <td><p class="link"><a href="'+permitTag+
                        '">'+boardList[i].title+'</a></p></td>' +
                        '                            <td class="center">'+boardList[i].writer+'</td>';
                    if(i%5 == 4) {
                        resultLi += '</dd><dd>';
                    }
                }
                resultLi += '                        </tr>';
        }
        resultParent.append(resultLi);
        //targetFocus($('#boardList').find('tr').filter('[data-index="'+ boardList[0].board_idx +'"]'));
        targetFocus($('.board-more'));
    }

    /**
     * @param res
     * @param res.resultData
     * @param res.code
     * @param res.message
     */
    var boardListMoreBtn = $('.bt-more-bar');
    boardListMoreBtn.on('click',function () {
        var length = boardListMoreBtn.data("count");
        console.log('test : '+length);
        if(length < 20) {
            limit = true;
        } else {
            length += addNum;
        }
        if(!limit) {
            var url = '/board/listmore/'+boardListMoreBtn.data("category")+'?length='+length;
            console.log(url);
            loading(true);

            $.get(url).done(function (res) {
                var resData = res.resultData;
                var resError = res.code;
                var resMsg = res.message;

                if(resError == 'FAIL'){
                    alert('네트워크 장애가 발생하였습니다. \n다시 시도해 주시기 바랍니다.');
                    console.log('fail');
                }
                else{
                    append(resData);
                    console.log('ok');
                }
                loading(false);
            }).fail(function () {
                loading(false);
                console.log('fail');
            }).always(function () {
                // all BoardList count
                boardListMoreBtn.data("count",$('#boardList').find('tr').length);
                console.log(boardListMoreBtn.data('count'));
            });
        } else {
            alert('더이상 불러올 데이터가 없습니다.');
        }
    });
}

function deleteBoardBtn() {
    var deleteBoardBtn = $('#deleteBoardBtn');
    deleteBoardBtn.on('click',function () {
        console.log('deleteBoardBtn');
        if(!$('#islogin').data('islogin')) {
            alert('로그인이 필요합니다.');
            return;
        }
        var category = deleteBoardBtn.data("category");
        var boardIdx = $('#boardIdx').val();
        var url = '/board/delete/'+category+'?boardIdx='+boardIdx;
        console.log(url);
        $.get(url).done(function (res) {
            var resData = res.resultData;
            var resError = res.code;
            var resMsg = res.message;

            if(resError === 'FAIL') {
                // 실패
                alert(resMsg);
                console.log('fail');
            } else{
                // 성공
                console.log('ok');
                //getReplyList($('#idx').val());
                //alert(resMsg);
                location.href = '/board/list/'+category;
            }
        });
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isLogin() {
    if(!$('#islogin').data('islogin')) {
        alert('로그인이 필요합니다.');
        return false;
    } else {
        return true;
    }
}