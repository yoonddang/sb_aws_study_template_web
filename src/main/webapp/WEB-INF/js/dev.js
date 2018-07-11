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

function getTypeByInt(val) {
    var type;
    if (val === 'album') {
        type = 1;
    }
    if (val === 'sound') {
        type = 2;
    }
    if (val === 'music') {
        type = 3;
    }
    if (val === 'star') {
        type = 4;
    }
    if (val === 'crown') {
        type = 5;
    }
    if (val === 'real') {
        return;
    }
    return type;
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


// 메인 랭킹 리스트 컨트롤
function tabDataAct(callClass, val) {
    /*
     type - 호출된 곳 (data-fun)
     val - 변수 (data-value)
     */
    var url, type;
    if (val == 1) {
        type = 'album';
        url = '/ranking/main/album';
    }
    if (val == 2) {
        type = 'sound';
        url = '/ranking/main/sound';
    }
    if (val == 3) {
        type = 'music';
        url = '/ranking/main/music';
    }
    if (val == 4) {
        type = 'star';
        url = '/ranking/main/star';
    }
    if (val == 5) {
        //type = 'real';
        type = 'crown';
        //url = '/ranking/main/real';
        url = '/ranking/main/crown';
    }
    if (val == 6) {
        return;
    }

    /* main 랭킹 순위 불러오기*/
    if (callClass === 'main-ranking') {
        console.log(callClass + ', ' + type);
        loading(true);
        $.get(url, function (data) {
            $('.ajax-data-ranking').html(data);
        }).done(function () {
            rankChangeControl();
            loading(false);
            ui.tabs();
        });
    }

    /* 랭킹페이지 Term 변경 */
    var rankingData = $('.ranking-data-sec');
    if (callClass === 'term-ranking') {
        if(!checkRoleTerm(type, val)) {
            return;
        }

        console.log(callClass + ', ' + val);
        rankingData.data('term',val);
        console.log('term test : ',rankingData.data('term'));
        rankingInit();
    }

    if (callClass === 'artistType-ranking') {
        url = "/ranking?type="+rankingData.data('type')+"&term="+rankingData.data('term')+"&artistType="+val;
        console.log(callClass + ', ' + url);
        location.href = url;
    }
}


function rankingInit() {
    if($('.ranking-wrap').length == 0) {return ;}
    console.log('Ranking Page init');
    var rankingData = $('.ranking-data-sec');
    var urlList;
    var type = rankingData.data('type');
    var term = rankingData.data('term');
    var artistType = rankingData.data('artisttype');

    // 좌측 순위 리스트 call
    urlList = '/ranking/list/'+type+'?term='+term+'&artistType='+artistType;
    console.log(urlList);
    loading(true);
    $.get(urlList, function (data) {
        $('.ranking-scroll').html(data);
    }).done(function () {
        loading(false);
        rankChangeControl();
        $('#listTenMoreBtn').data('length', 30);

        targetInit();

    }).fail(function () {
        loading(false);
        console.log('call list fail');
    });

}

function infoDetail(target) {
    // TODO urlInfo와, infoDetail()호출을 위한 idx,rank 초기화작업 필요.
    var rankingData = $('.ranking-data-sec');
    var type = getTypeByInt(rankingData.data('type'));
    var artistType = rankingData.data('artisttype');
    var term = rankingData.data('term');

    var urlInfo = setUrlInfo(type, target);
    console.log(urlInfo);
    // 우측 상세정보 call
    loading(true);
    $.get(urlInfo, function (data) {
        $('.top-info-box').html(data);
    }).done(function () {
        loading(false);

        rankingDetail(type, term, artistType, target);

    }).fail(function () {
        loading(false);
        console.log('call info fail');
    });
}

function targetInit() {
    var rankingData = $('.ranking-data-sec');
    var target = rankingData.data('target');
    var type = rankingData.data('type');
    var idx2 = rankingData.data('idx2');
    var idx3 = rankingData.data('idx3');
    var artistType = rankingData.data('artisttype');
    var term = rankingData.data('term');

    var firstTarget = function () {
        var first = $('.first');
        console.log('no target, first : '+first.data('idx'));

        $('#clipTarget').text(window.location.href);
        infoDetail(first);
        //targetMove(first);
    }

    var searchTarget = function () {
        var targetEle = null;
        $('.ranking-list').find('li').each(function () {
            if($(this).data('idx') == target) {
                if(type == 'sound') {
                    if($(this).data('idx2') == idx2 && $(this).data('idx3') == idx3) {
                        $('#clipTarget').text(window.location.host +'/ranking/?type='+type+'&term='+term+'&artistType='+artistType+'&target='+target+'&idx2='+idx2+'&idx3='+idx3);
                        targetEle = $(this);
                    }
                } else {
                    $('#clipTarget').text(window.location.host +'/ranking/?type='+type+'&term='+term+'&artistType='+artistType+'&target='+target);
                    targetEle = $(this);
                }
            }
        })
        return targetEle;
    }

    if(target === 'no') {
        // no target, datail : first
        firstTarget();
    } else {
        // yes target, datail : idx, Searching...
        console.log('yes target, target : '+target);

        var targetEle = searchTarget();
        if(targetEle != null) {
            infoDetail(targetEle);
        } else {
            //alert('현재 순위 리스트에 없는 항목 입니다.');
            //firstTarget();
            $('#realRank').hide();
            $('#noRank').show();
            console.log('no rank : '+target)
            $('.noRankLi').data('idx',target);
            if(type == 'sound') {
                $('.noRankLi').data('idx2',idx2);
                $('.noRankLi').data('idx3',idx3);
            }
            infoDetail($('.noRankLi'));
        }

    }
}


// 좌측 리스트에서 타겟에 sel 클래스 부여 및 위치이동
function targetMove(e){
    var $eleGroup = $('.ranking-scroll .ranking-list'), current = $eleGroup.find('.sel');
    var $ele = e, curNum = 0;
    if(current.index() != $ele.index()){
        curNum = $ele.index();
        $ele.addClass('sel').siblings().removeClass('sel');

        console.log('curNum : '+curNum+'current index : '+current.index()+'ele index : '+$ele.index());
        setTimeout( function () {
            $('.ranking-scroll .in').mCustomScrollbar('scrollTo', function(){
                console.log(curNum<=1 ? 0 : $ele.prev().position().top+2);
                return curNum<=1 ? 0 : $ele.prev().position().top+2;
            });
        }, 100);

    }
};

function setUrlInfo(type, target) {

    var urlInfo, engText, subTitle, infoText;
    var idx =  target.data('idx');
    if (type == 1) {
        urlInfo = '/info/album?idx='+idx;
        engText = 'TEMPLATE</br>TEMPLATE';
        subTitle = '';
        infoText = '';
    }
    if (type == 2) {
        var idx2 = target.data('idx2');
        var idx3 = target.data('idx3');
        urlInfo = '/info/sound?idx='+idx+'&idx2='+idx2+'&idx3='+idx3;
        engText = 'TEMPLATE</br>TEMPLATE';
        subTitle = '';
        infoText = '';
    }
    if (type == 3) {
        urlInfo = '/info/music?idx='+idx;
        engText = 'TEMPLATE</br>TEMPLATE';
        subTitle = '';
        infoText = '';
    }
    if (type == 4) {
        urlInfo = '/info/star?idx='+idx;
        engText = 'TEMPLATE</br>TEMPLATE';
        subTitle = '';
        infoText = '';
    }
    if (type == 6) {
        return;
    }
    // 상단 백그라운드 택스트 변경
    console.log(type+' / ');
    console.log('eng-text : '+engText);
    $('.eng-txt').html(engText);
    $('.tx-group').find('em').text(subTitle);
    $('.tx-group').find('span').text(infoText);
    return urlInfo;
}

function checkRoleTerm(type, term){
    var role = $('#islogin').data('role');
    if(type === 4) {
        return true;
    }
    if(term === "week" && role < 2) {
        // silver, gold, vip
        if(confirm("실버회원 이상부터 이용 가능합니다. 결제하러 가시겠습니까?")){
            popup.openTarget($('#pop-membership'));
            return false;
        } else {
            return false;
        }
    } else if(term === "month" && role < 3) {
        // gold, vip
        if(confirm("골드회원 이상부터 이용 가능합니다. 결제하러 가시겠습니까?")){
            popup.openTarget($('#pop-membership'));
            return false;
        } else {
            return false;
        }
    } else if(term === "year" && role < 4) {
        // vip
        if(confirm("VIP회원 이상부터 이용 가능합니다. 결제하러 가시겠습니까?")){
            popup.openTarget($('#pop-membership'));
            return false;
        } else {
            return false;
        }
    } else if(term === "real" && role < 1) {
        location.href("/login");
    } else if(term === "daily" && role < 1) {
        location.href("/login");
    } else {
        return true;
    }
}


function makeTempGraph(type) {
    if(type == 2) {
        var yLabelDataTempSound = ['A', 'B', 'C', 'D'];
        var xLabelDataTempSound = ['0시','4시','8시','12시','16시','18시','24시'];
        var rankDataTempSound = [
            {data:[-120, 132, 101, 134, 90, 230, 210], color: '#5abff8'},
            {data:[220, 182, 191, 234, 290, 330, 310], color: '#ec407a'},
            {data:[150, 232, 201, 154, 190, 330, 410], color: '#3bde3b'},
            {data:[300, 400, 500, 600, 200, 100, 450], color: '#71a4ff'}
        ];
        rankingChart('chart', yLabelDataTempSound, xLabelDataTempSound, rankDataTempSound, 0, 600);
    } else {
        var yLabelDataTempAlbum = ['1위','2위','3위'];
        var xLabelDataTempAlbum = ['0시','4시','8시','12시','16시','18시','24시'];
        var rankDataTempAlbum = [
            {data:[-120, 132, 250, 134, 90, 230, 210], color: '#5abff8', zindex: 10, borderWidth: 2},
            {data:[220, 182, 191, 234, 290, 330, 310], color: '#ec407a', zindex: 4},
            {data:[150, 232, 201, 154, 190, 330, 410], color: '#3bde3b'}
        ];
        rankingChart('chart', yLabelDataTempAlbum, xLabelDataTempAlbum, rankDataTempAlbum, 0, 600);
    }
}

function rankingDetail(type, term, artistType, target) {
    /* ct(랭킹, 음원, 스타, 뮤직, 리얼), tab(종합, 남자솔로, 여자솔로, 그룹), term(tab별 시간) */

    var rank = target.data('rank');
    var idx =  target.data('idx');

    var url = '', url2 = '';
    if (type == 1) {
        url = '/ranking/detail/album/album?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
        url2 = '/ranking/chart/album/album?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
    }
    if (type == 2) {
        var idx2 = target.data('idx2');
        var idx3 = target.data('idx3');
        url = '/ranking/detail/song?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx + '&idx2=' + idx2 + '&idx3=' + idx3;
        url2 = '/ranking/chart/song?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx + '&idx2=' + idx2 + '&idx3=' + idx3;
    }
    if (type == 3) {
        url = '/ranking/detail/album/music?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
        url2 = '/ranking/chart/album/music?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
    }
    if (type == 4) {
        url = '/ranking/detail/artist/star?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
        url2 = '/ranking/chart/artist/star?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
    }
    if (type == 5) {
        //url = '/ranking/detail/artist/real?term=' + term + '&artistType=' + tab + '&rank=' + rank + '&idx=' + idx;
        //url2 = '/ranking/chart/artist/real?term=' + term + '&artistType=' + tab + '&rank=' + rank + '&idx=' + idx;
        url = '/ranking/detail/artist/crown?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
        url2 = '/ranking/chart/artist/crown?term=' + term + '&artistType=' + artistType + '&rank=' + rank + '&idx=' + idx;
    }

    // 상세 데이터 호출
    console.log(url);
    loading(true);
    $.get(url, function (data) {
        $('.detail-more-box').html(data);
    }).done(function () {

        if ($('.chart-info').length == 0) {
            loading(false);
            console.log('no chart graph data');
            return;
        }
        console.log(url2);
        /**
         * @param result
         * @param result.resultData
         * @param result.resultData.rankChartListLabel[].foo
         * @param result.resultData.rankChartListTarget[].foo
         * @param result.resultData.rankChartListBefore[].foo
         * @param result.resultData.rankChartListAfter[].foo
         * @param result.resultData.melon[].foo
         * @param result.resultData.mnet[].foo
         * @param result.resultData.genie[].foo
         * @param result.resultData.bugs[].foo
         */
        // 그래프 데이터 호출
        if(!$('.chart-info').data('view-rank-detail')) {
            makeTempGraph(type);
        } else {
            $.get(url2).done(function (result) {
                loading(false);
                //TODO 랭킹 타입 - 음반 sales_volume, 뮤직,리얼,스타 는 rank_point, 음원은 음원사_rank
                //TODO 컨트롤러에 produce json 설정하여 아래 json.parse 없이 바로 사용하는 형태로 코딩
                //TODO 음원의 경우 그래프 선 4개가 뿌려질 수 있도록 ui.js 로직 확인하여 적용방안 구현

                var resData = result.resultData;
                var yLabelData, xLabelData = [], data = [], rankData = [];
                var rank = $('#rank').text()*1;
                var min = Infinity, max = -Infinity;

                xLabelData = resData.rankChartListLabel;

                if(type == 2) {
                    data[0] = resData.melon;
                    data[1] = resData.mnet;
                    data[2] = resData.genie;
                    data[3] = resData.bugs;
                } else {
                    data[0] = resData.rankChartListTarget;
                    data[1] = resData.rankChartListBefore;
                    data[2] = resData.rankChartListAfter;
                }

                data.forEach(function(x) {
                    var rowMax = Math.max.apply(null, x);
                    var rowMin = Math.min.apply(null, x);

                    if (rowMax > max) max = rowMax;
                    if (rowMin < min) min = rowMin;

                });

                if(type == 2) {
                    yLabelData = ['A', 'B', 'C', 'D'];
                    rankData = [
                        {data: data[0], color: '#5abff8'},
                        {data: data[1], color: '#ec407a'},
                        {data: data[2], color: '#3bde3b'},
                        {data: data[3], color: '#71a4ff'}

                    ];
                    rankingChart('chart', yLabelData, xLabelData, rankData, min, max, term);
                } else {
                    if(rank == 1) {
                        console.log(data[0]);
                        yLabelData = [rank+'위', (rank+1)+'위', (rank+2)+'위'];
                        rankData = [
                            {data: data[0], color: '#5abff8', zindex: 10, borderWidth: 3},
                            {data: data[1], color: '#ec407a', zindex: 4},
                            {data: data[2], color: '#3bde3b'}
                        ];
                        rankingChart('chart', yLabelData, xLabelData, rankData, min, max, term);
                    } else {
                        yLabelData = [(rank-1)+'위', rank+'위', (rank+1)+'위'];
                        rankData = [
                            {data: data[1], color: '#5abff8', zindex: 10},
                            {data: data[0], color: '#ec407a', zindex: 4, borderWidth: 3},
                            {data: data[2], color: '#3bde3b'}
                        ];

                        rankingChart('chart', yLabelData, xLabelData, rankData, min, max, term);
                    }
                }

            }).fail(function () {
                loading(false);
                console.log('call chart graph fail');
            });
        }
    }).fail(function () {
        loading(false);
        console.log('call detail fail');
    }).always(function () {
        rankingUi.init();
        targetMove(target);
    });

    getReplyList(idx);
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
    } else if(category == 5) {
        title = '자유롭게 소통하세요. 단, 주제와 무관하거나 악성 게시글은 삭제될 수 있습니다.';
        engText = 'TEMPLATE</br>FREEBOARD';
    } else if(category == 6) {
        title = '폐쇄됩니다.';
        engText = 'TEMPLATE</br>1:1 INQUIRY';
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

function searchMoreBtn() {
    var searchMoreBtn = $('#searchMoreBtn');
    searchMoreBtn.on('click',function () {
        var url = '/search/more/'+searchMoreBtn.data("name")+'?keyword='+searchMoreBtn.data("keyword")+'&length='+searchMoreBtn.data("length");
        console.log(url);
        loading(true);

        $.get(url).done(function (res){
            var resultList;
            var resError = res.code;
            var resMsg = res.message;

            console.log(res.resultData);

            if(resError == 'FAIL')
                alert('다시 시도해 주시기 바랍니다.');
            else{
                var resultLi;
                var resultUl = $('#searchList').find('ul');
                searchMoreBtn.data("length",searchMoreBtn.data("length")+10);
                switch (searchMoreBtn.data("name")) {
                    case "album":
                        resultList = res.resultData.albumList;
                        for ( var i in resultList) {
                            resultLi = '<li>' +
                                '           <a href="/info/album?idx=' + resultList[i].album_idx + '">' +
                                '           <div class="thum"><img class="album" src="' + resultList[i].album_img + '" alt=""/></div>' +
                                '               <div class="info">' +
                                '                   <p class="subject">' + resultList[i].album_name + '</p>' +
                                '                   <p>' + resultList[i].artist_name + '</p>' +
                                '                   <p class="date">' + resultList[i].sale_date + '</p>' +
                                '               </div>' +
                                '           </a>' +
                                '       </li>';
                            resultUl.append(resultLi);
                        }
                        break;
                    case "artist":
                        resultList = res.resultData.artistList;
                        for ( var i in resultList) {
                            resultLi = '<li>' +
                                '           <a href="/info/artist?idx=' + resultList[i].artist_idx + '">' +
                                '           <div class="thum"><img class="artist" src="' + resultList[i].artist_img + '" alt=""/></div>' +
                                '               <div class="info">' +
                                '                   <p class="subject">' + resultList[i].artist_name + '</p>' +
                                '                   <p class="etc-bar">' +
                                '                      <span>음반 ' + resultList[i].album_count + '</span>' +
                                '                      <span>곡 ' + resultList[i].song_count + '</span>' +
                                '                    </p>' +
                                '               </div>' +
                                '           </a>' +
                                '       </li>';
                            resultUl.append(resultLi);
                        }
                        break;
                    case "song":
                        resultList = res.resultData.songList;
                        for ( var i in resultList) {
                            resultLi = '<li>' +
                                '           <a href="/info/song?idx=' + resultList[i].song_idx + '&idx2=' + resultList[i].album_idx + '&idx3=' + resultList[i].song_num + '">' +
                                '              <div class="num"><strong>1</strong></div>' +
                                '              <div class="subject">' +
                                '                 <p>' + resultList[i].song_name + '</p>' +
                                '                 <p class="etc-bar"><span>' + resultList[i].album_name + '</span></p>' +
                                '              </div>' +
                                '              <div class="etc">' +
                                '                 <p>' + resultList[i].artist_name + '</p>' +
                                '              </div>' +
                                '           </a>' +
                                '       </li>';
                            resultUl.append(resultLi);
                        }
                        break;
                    default:
                        resultLi = "";
                        break;
                }
                loading(false);
                console.log('ok');
                if(resultList.length === 0) {
                    alert("더이상 검색 결과가 없습니다.");
                }
            }
        }).fail(function () {
            loading(false);
            console.log('fail');
        });
    });
}

function listTenMoreBtn() {
    if($('.ranking-list').length != 0) {
        var moreBtn = $('#listTenMoreBtn');
        var rankingData = $('.ranking-data-sec');
        var url;
        var type = rankingData.data('type');
        var term = rankingData.data('term');
        var artistType = rankingData.data('artisttype');
        var maxRank = moreBtn.data('length');

        if(maxRank < (type === 5 ? 30 : 100)) {
            if(type === 5 && maxRank > 15) {
                // 크라운은 30위까지만 존재함으로 최초 리스트 크기 5에서 10씩 증가할때 20보다 큰 경우에는 다음 값이 30보다 크기 때문에 10증가가 아닌 30 고정
                maxRank = 35;
            } else {
                maxRank += 10;
            }
        } else {
            alert('더이상 리스트가 없습니다.');
        }

        // 좌측 순위 리스트 call
        url = '/ranking/list/'+type+'?term='+term+'&maxRank='+maxRank+'&artistType='+artistType;
        console.log(url);
        loading(true);
        $.get(url, function (data) {
            $('.ranking-scroll').html(data);
        }).done(function () {
            loading(false);
            console.log('ok');
            if(maxRank < (type === 5 ? 30 : 100)) {
                console.log('maxRank :'+maxRank)
                moreBtn.data("length", moreBtn.data("length") + 10);
            }
            rankChangeControl();
        }).fail(function () {
            loading(false);
            console.log('call list fail');
        }).always(function () {
            rankingUi.init();
            rankingUi.reSet();

            // TODO 리스트 마지막 항목으로 자동 스크롤 되면 좋을듯 (마지막 항목 인식값이 필요)
            /*$('.ranking-scroll .in').mCustomScrollbar('scrollTo', function(){
                console.log(curNum<=1 ? 0 : $ele.prev().position().top+2);
                return curNum<=1 ? 0 : $ele.prev().position().top+2;
            });*/

        });
    }
}

var ifMypage = false;
function mypageBtn() {
    if($('.mypage-index-sec').length==1) {
        ifMypage = true;
    }

    if($('#pop').data('pop') === 1) {
        popup.open($('#pop'));
    }

    $('#changeTempPassword').on('click',function () {
        postAjaxMypage('/mail/changeTempPassword','pwFormDataTemp');
    });
    $('#changePassword').on('click',function () {
        postAjaxMypage('/user/changePassword','pwFormData');
    });
    $('#changePhone').on('click',function () {
        postAjaxMypage('/user/changePhone','phoneFormData');
    });
    $('#deleteUser').on('click',function () {
        postAjaxMypage('/user/deleteUser','deleteFormData');
    });
    $('#changeRole').on('click',function () {
        //alert('준비중 입니다.');
        location.replace('/bill/mo/membership');
    });
    $('#moreBillLog').on('click',function () {
        /**
         * @param resData.userBillLog[]
         * @param userBillLog[].creditEnd
         * @param userBillLog[].creditStart
         * @param userBillLog[].price
         * @param userBillLog[].serviceName
         * @param userBillLog[].purchaseName
         * @param userBillLog[].status
         * @param userBillLog[].statusName
         * @param userBillLog[].addCoin
         */
        function addList(resData) {
            var billList = resData.userBillLog;
            var resultLi;
            var resultUl = $('#userBillLog');
            var count = 0;
            for ( var i in billList) {

                resultLi = '<tr>' +
                    '           <td class="center">'+(billList[i].status == 4 ? billList[i].creditEnd : billList[i].creditStart) +'</td>' +
                    '           <td class="left">'+billList[i].purchaseName+'</td>' +
                    '           <td class="left">'+billList[i].price+'원</td>' +
                    '           <td class="center">'+billList[i].serviceName+'</td>' +
                    '           <td class="left">'+billList[i].statusName+'</td>' +
                    '           <td class="center"><i class="cash">'+(billList[i].status == 4 ? billList[i].addCoin : '-')+'</i></td>' +
                    '       </tr>';
                resultUl.append(resultLi);
                count ++;
            }
            $('#userBillLogCount').val($('#userBillLogCount').val()*1+count);
            console.log(count);
        }
        postAjaxMypageResult('/user/moreUserBillLog','userBillLogCount',addList);
    });
    /**
     * @param resData.inviteFriends[]
     * @param resData.inviteFriends[]
     * @param resData.inviteFriends[].nickname1
     * @param resData.inviteFriends[].email1
     */
    $('#moreInviteFriends').on('click',function () {
        function addList(resData) {
            var inviteFriends = resData.inviteFriends;
            var resultLi;
            var resultUl = $('#inviteFriends');
            var count = 0;
            for ( var i in inviteFriends) {

                resultLi = '<li>' +
                    '           <span class="photo"></span>' +
                    '           <div class="info">' +
                    '               <strong>'+inviteFriends[i].nickname1+'</strong>' +
                    '               <p>'+inviteFriends[i].email1+'</p>' +
                    '           </div>' +
                    '       </li>';
                resultUl.append(resultLi);
                count ++;
            }
            $('#inviteFriendsCount').val($('#inviteFriendsCount').val()*1+count);
        }
        postAjaxMypageResult('/user/moreInviteFriends','inviteFriendsCount', addList);
    });
    /**
     * @param resData.year
     * @param resData.loveKissList
     * @param resData.loveKissList[]
     * @param resData.loveKissList[].artist_img
     * @param resData.loveKissList[].artist_name
     * @param resData.loveKissList[].nowLoveKiss
     * @param resData.loveKissList[].lovekiss
     * @param resData.loveKissList[].totalLoveKiss
     * @param resData.loveKissList[].myLoveKissP
     */
    $('#moreLoveKissList').on('click',function () {
        function addList(resData) {
            var loveKissList = resData.loveKissList;
            var resultLi;
            var resultUl = $('#loveKissList');
            var count = 0;
            var myLoveKissPTag;
            for ( var i in loveKissList) {

                myLoveKissPTag = loveKissList[i].myLoveKissP <= 50 ? 'left: '+loveKissList[i].myLoveKissP : 'right: '+(100 - loveKissList[i].myLoveKissP);

                resultLi = '<li>' +
                    '                            <span class="photo" style="background: url('+loveKissList[i].artist_img+') 50% no-repeat; background-size: cover; "></span>' +
                    '                            <div class="info">' +
                    '                                <div class="row">' +
                    '                                   <span class="row left"><strong>'+loveKissList[i].artist_name+'</strong></span>' +
                    '                                </div>' +
                    '                                <div class="row">' +
                    '                                    <p >'+resData.year+'</p>' +
                    '                                    <span class="my-love">'+loveKissList[i].nowLoveKiss+'</span>' +
                    '                                </div>' +
                    '                                <div class="row">' +
                    '                                    <p>TOTAL</p>' +
                    '                                    <span class="point"><i class="cash my-love">'+loveKissList[i].lovekiss+'</i>/<i class="cash total-love">'+loveKissList[i].totalLoveKiss+'</i></span>' +
                    '                                </div>' +
                    '                                <div class="lovekiss-gauge">' +
                    '                                    <div class="bar">' +
                    '                                        <p class="on" style="width: '+loveKissList[i].myLoveKissP+'%;"><em style="'+myLoveKissPTag+'">'+loveKissList[i].myLoveKissP+'%</em></p>' +
                    '                                        <p class="off" style="width: '+(100-loveKissList[i].myLoveKissP)+'%;"><em></em></p>' +
                    '                                    </div>' +
                    '                                </div>' +
                    '                            </div>' +
                    '                        </li>';
                resultUl.append(resultLi);
                count ++;
            }
            $('#loveKissListCount').val($('#loveKissListCount').val()*1+count);
        }
        postAjaxMypageResult('/user/moreLoveKissList','loveKissListCount', addList);
    });
    $('#moreQna').on('click',function () {
        postAjaxMypageResult('/user/moreQna','qna');
        // $('.faq-list').load('www.naver.com');
    });

    if($('#pwWriteBox').length==1) {
        $('#checkPwBtn').on('click',function () {
            checkPassWordForMyPage();
        });
    }
}

/**
 * @param res
 * @param res.resultData
 * @param res.code
 * @param res.message
 */
function checkPassWordForMyPage() {
    $.ajax({
        url : '/user/checkPassword',
        data : $('#password').serialize(),
        type : 'POST',
        dataType : 'json',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        }
    }).done(function(res){
        var resData = res.resultData;
        var resError = res.code;
        var resMsg = res.message;

        if(resError == 'FAIL')
            alert(resMsg);
        else{
            //alert('비밀번호 확인 성공!');
            location.replace('/user/mypage');
        }
    });
}

/**
 * @param url
 * @param id
 * @param res
 * @param res.resultData
 * @param res.code
 * @param res.message
 */
function postAjaxMypage(url, id) {
    if(ifMypage) {
        location.replace(url);
    } else {
        console.log($('#'+id).val());
        $.ajax({
            url : url,
            data : $('#'+id).serialize(),
            type: 'POST',
            dataType: 'json',
            /*contentType: "application/json; charset=UTF-8",*/
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json");

                xhr.setRequestHeader("contentType", "application/json; charset=UTF-8");
            }

        }).done(function(res){
            var resError = res.code;
            var resMsg = res.message;

            if(resError == 'FAIL')
                alert(resMsg);
            else{
                alert(resMsg);
                if(id === 'pwFormDataTemp' || id === 'pwFormData') {
                    location.replace('/');
                } else {
                    location.replace('/user/mypage');
                }
            }
        });
    }
}

/**
 * @param url
 * @param id
 * @param addList
 * @param res
 * @param res.resultData
 * @param res.code
 * @param res.message
 */
function postAjaxMypageResult(url, id, addList) {
    console.log(url+'?'+id+'='+$('#'+id).val());
    $.ajax({
        url : url+'?'+id+'='+$('#'+id).val(),
        type : 'GET',
        dataType : 'json',
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        }

    }).done(function(res){
        var resData = res.resultData;
        var resError = res.code;
        var resMsg = res.message;

        if("FAIL" === resError){
            alert('더이상 불러올 데이터가 없습니다.');
            return null;
        }
        else{
            addList(resData);
        }
    });
}

function qnaToggleList() {
    if($('.etc-contents').length==0){return;}
    var $ele = $('.etc-contents').find('#etc-tab');
    var current = $ele.find('li a.act').data('toggle');
    var togglAct = function(current){
        $('.toggle-list').each(function(){
            $(this).hide();
            $('#'+current).show();
            console.log(current);
        });
    }

    $ele.find('li').each(function(){
        $(this).find('a').on('click', function(){
            console.log('a : '+$(this).data('toggle'));
            $(this).toggleClass('act');
            $(this).parent().siblings().find('a').removeClass('act')
            current = $(this).data('toggle');

            togglAct(current);
        });
    });
    togglAct(current);

}

function rankChangeControl() {
    if($('.num-change').length==0){return;}
    var numChange = $('.num-change');

    numChange.each(function() {
        var $this = $(this);
        var rankDiff = $this.text()*1;
        //console.log(rankDiff);
        if(rankDiff > 0) {
            if(rankDiff > 10 && rankDiff < 100) {
                $this.addClass('ex-up');
            } else if(rankDiff >= 100) {
                $this.addClass('hot');
                $this.text('HOT');
            } else {
                $this.addClass('up');
            }
        } else if(rankDiff < 0) {
            rankDiff = Math.abs(rankDiff);
            $this.text(rankDiff);
            if(rankDiff > 10) {
                $this.addClass('ex-down');
            } else {
                $this.addClass('down');
            }
        } else {
            $this.text('-');
        }
    });
}

function crownAritstAlbumHide() {
    if($('.progress-grp').length == 0) { return; }

    $('.progress-grp').each(function(){
        var count = 0;
        $(this).find('p').each(function () {
            if (count > 5) {
                $(this).hide();
            }
            count ++;
        });
    });

    $('.crown-fold').each(function(){
        $(this).on('click',function () {
            if( $(this).data('fold') === 1) {
                $(this).parent().find('.progress-grp').each(function(){
                    var count = 0;
                    $(this).find('p').each(function () {
                        if (count > 5) {
                            $(this).show();
                        }
                        count ++;
                    });
                });
                $(this).data('fold',0);
                $(this).text("닫기");
            } else {
                $(this).parent().find('.progress-grp').each(function(){
                    var count = 0;
                    $(this).find('p').each(function () {
                        if (count > 5) {
                            $(this).hide();
                        }
                        count ++;
                    });
                });
                $(this).data('fold',1);
                $(this).text("더보기");
            }
        });
    });
}

function searchBtn(){
    if($('#keyword').val() != null || $('#keyword').val() != undefined) {
        location.href = '/search/all?keyword='+encodeURIComponent($('#keyword').val());
    } else {
        alert('올바른 검색어를 입력해 주세요.');
    }
}

function enterPress() {
    $("input[id=keyword]").bind('focus keyup', function() {
        if($("input[id=keyword]").data('keyword') === 'nodata') {
            $("input[id=keyword]").data('keyword',$("input[id=keyword]").val());
        }
    });

    if($("input[id=keyword]").length == 1) {
        if($("input[id=keyword]").data('keyword') !== 'nodata') {
            console.log($("input[id=keyword]").data('keyword'));
            $("input[id=keyword]").removeAttr('placeholder');
            $("input[id=keyword]").val($("input[id=keyword]").data('keyword'));
        } else {
            $("input[id=keyword]").attr('placeholder','검색어를 입력하세요');
        }
    }

    // 검색, 로그인, 마이페이지 2차비밀번호, 비밀번호 변경, 핸드폰 번호 변경,
    $("input[id=keyword]").keydown(function (key) {
        if(key.keyCode == 13) {
            console.log('Enter press : bt-search');
            if($(this).val().length >= 1) {
                searchBtn();
            } else {
                alert('검색어를 입력해 주세요.');
            }
        }
    });

    $('#wrap').find('#container').keydown(function (key) {
        if(key.keyCode == 13){//키가 13이면 실행 (엔터는 13)
            console.log('Enter press wrap');
            if($('#loginBtn').length == 1) {
                regexcheck();
            }
            if($('#changeTempPassword').length == 1) {
                postAjaxMypage('/mail/changeTempPassword','pwFormDataTemp');
            }
            if($('#changePassword').length == 1) {
                postAjaxMypage('/user/changePassword','pwFormData');
            }
            if($('#changePhone').length == 1) {
                postAjaxMypage('/user/changePhone','phoneFormData');
            }
            if($('#checkPwBtn').length==1) {
                checkPassWordForMyPage();
            }
        }
    });
}


function snsShare() {
    $('.sns').click(function() { // 소셜공유 버튼을 누르면 해당하는 소셜로 공유
        var url = $('#clipTarget').text();
        var snsUrl;
        var popup_setting = "width=500, height=500, left-50, top=50";
        var $this = $(this);
        switch ($this.data('snskind')) {
            case 'facebook': {
                snsUrl = "http://www.facebook.com/sharer/sharer.php?u="
                    + encodeURIComponent(url) + "&enc=utf-8";

                break;
            }
            case 'google': {
                snsUrl = "https://plus.google.com/share?url="
                    + encodeURIComponent(url);
                break;
            }
            case 'naver': {
                snsUrl = "http://blog.naver.com/openapi/share?url="
                    + encodeURIComponent(url);
                break;
            }
        }
        console.log(snsUrl);
        //window.open(snsUrl);
        window.open(snsUrl, "sharepop", popup_setting);
    });
}

function initSearchPage() {
    if($('.search_result_wrap').length == 0) {
        return;
    }
    $('.bt-more').on('click',function () {
        var current = $(this).parent().parent().data('tab-num');
        console.log('more btn : '+current);
        $(".is-tab-active").data('current',current);
        ui.tabs();
    });
}

function classifySearchTab(current) {
    /*
    ui.js tab에서 전달되는 current값은 선택된 tab의 data('tab-num')이다.
    선택된 탭을 제외한 모든 .result_section 은 .hide()시키고
    선택된 탭의 결과 리스트를 각 단위별로 .show()해준다.
    하단에 더보기 버튼을 누른 경우 각 단위별로 .show()를 해주며 오픈된 개수가 검색 결과 카운트와 같은 경우
    더이상 불러올 데이터가 없다는 경고창을 띄워준다.

    각 탭별로 더보기시 참조하는 요소가 다르다....
    일단 다까는 형태로 하고 더보기 버튼은 추후 구현이 어떠한가???

     */
    var title = $('.txt_result');
    var tab = $('.result_section');
    if(current == 1) {
        console.log('aaa');
        title.css('border-bottom','1px solid #d6d6d6');
        $('.result_section').show();
        $('.bt-more').show();
        var max = 5;
        tab.find('tr').each(function () {
            if($(this).data('idx') > max) {
                $(this).hide();
            }
        });
        tab.find('li').each(function () {
            if(current == 2) max = 3;
            if($(this).data('idx') > max) {
                $(this).hide();
            }
        });
    } else {
        if(current != 2) {
            title.css('border-bottom','0px');
        } else {
            title.css('border-bottom','1px solid #d6d6d6');
        }
        $('.bt-more').hide();
        $('.result_section').hide();
        tab = $('.result_section').filter('[data-tab-num="' + current + '"]');
        tab.show();

        if(current == 3) {
            tab.find('tr').show();
        } else {
            tab.find('li').show();
        }
    }


}

function isLogin() {
    if(!$('#islogin').data('islogin')) {
        alert('로그인이 필요합니다.');
        return false;
    } else {
        return true;
    }
}

function clipUrlv2(e) {
    if(isLogin()) {
        popup.open(e);
        popup.close($(e.data('this')));
        //clipboard = new Clipboard('#');
        e.attr("data-clipboard-action", "copy");
        e.attr("data-clipboard-target", ".plc_ip");
    } else {
        //popup.close($(e.data('this')));
    }
}

function loadCalendar() {
    if($('.calendar-frame').length == 0) return;
    console.log('getCalendar');
    $.get('/board/calendar', function (data) {
        $('.calendar-frame').html(data);
    }).done(function () {
        testInit();
    });
}