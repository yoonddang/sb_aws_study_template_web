//모듈 호출
startJs();

define(['jquery', 'slick', 'layout', 'dev', 'cusScroll'], function(){
    if (navigator.userAgent.match(/iPhone/) || navigator.userAgent.match(/iPad/) || navigator.userAgent.match(/Android/)) {
        location.replace('http://m.template.hart.com/');
    }
    layout.init();
    layout.menu();
    ui.init();
});


var ui = (function (){
    function controlTab() {
        var $ele = $('.tab.is-control');
        $ele.each(function () {
            var $this = $(this), current = $this.find('ul').data('current'), count = $this.find('ul li').length;
            var fun = $this.find('ul').data('fun');
            if($(this).hasClass('ty1')){
                $this.append('<div class="controls"><button class="i-btn bt-prev">prev</button><button class="i-btn bt-next">next</button></div>');
            }

            var scPos = function () {
                $this.find('a').removeClass('act');
                $this.find('li').filter('[data-value="' + current + '"]').find('a').addClass('act');
                var tit  = $this.find('li').filter('[data-value="' + current + '"]').find('a').text();
                // fun - callClass(탭메뉴), current - 탭메뉴 선택값, tit - 탭메뉴 선택 텍스트(타이틀표기용:사용x)
                if(!$this.hasClass('notAuto')) {
                    tabDataAct(fun, current, tit);
                    if(fun == 'term-ranking') {
                        $('.date').find('em').text($this.find('li').filter('[data-value="' + current + '"]').data('time'));
                    }
                } else {
                    $this.removeClass('notAuto');
                }
            }

            scPos();
            $this.find('li a').off('click').on('click', function () {
                /*if (current == $(this).parent().data('value')) {
                    return false;
                }*/
                current = $(this).parent().data('value');
                scPos();
            });
            $this.find('.controls button').off('click').on('click', function () {
                if (($(this).hasClass('bt-prev') && current - 1 < 1) || ($(this).hasClass('bt-next') && current + 1 > count)) {
                    return;
                }
                if ($(this).hasClass('bt-prev')) {
                    current = (current - 1 < 1) ? 1 : (current - 1);
                }
                if ($(this).hasClass('bt-next')) {
                    current = (current + 1 > count) ? count : current + 1;
                }
                scPos();
            });
        });
    }

    function toggleList() {
        if ($('.is-toggle').length == 0) {
            return;
        }
        var $ele = $('.is-toggle');
        $ele.find('li').each(function () {
            if ($(this).find('.an').length == 1) {
                $(this).find('.qs').off('click').on('click', function () {
                    $(this).parent().toggleClass('act').siblings().removeClass('act');
                });
            }
        });
    }

    function tabs() {
        if ($('.is-tab-active').length == 0) {return;}
        var $ele = $(".is-tab-active");
        var $tabCon = $('.' + $ele.data('tab-info'));
        var hashFlag = $ele.data('hash');
        var current = $ele.data('current') == undefined ? 1 : ($ele.data('current') == 'all' ? 0 : $ele.data('current'));
        if(hashFlag && location.hash !=''){
            current =  location.hash.replace(/[^0-9]/g,'');
        }

        var tabAct = function () {
            if($ele.data('tab-info') == 'search-group') {
                console.log('tabAct Search - current : '+current);
                classifySearchTab(current);
            }
            if (current == 0) {
                $ele.find('a').removeClass('act').filter('[data-tab-num="all"]').addClass('act');
                $tabCon.show();
            } else {
                $ele.find('a').removeClass('act').filter('[data-tab-num="' + current + '"]').addClass('act');
                $tabCon.hide().filter('[data-tab="' + current + '"]').show();
            }
            if(hashFlag){
                location.hash = current;
            }
        }

        tabAct();
        $ele.find('a').off('click').on('click', function () {
            current = ($(this).data('tab-num') == 'all') ? 0 : $(this).data('tab-num');
            tabAct();
            return false;
        });
    }

    function mainVisual(){
        if($('.m-visual .slider').length==0){return;}else{$('.m-visual .slider').slick({infinite: true, speed: 300, autoplay: true, autoplaySpeed: 4000});}
        if($('.ad-banner .slider').length==0){return;}else{$('.ad-banner .slider').slick({arrows: false, infinite: true, speed: 300, autoplay: true, autoplaySpeed: 4000});}
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
            $(this).parent().siblings('.subject').addClass('act-edit');
            return false;
        });
        var $replyClose = $('.reply-close-row a');
        $replyClose.off('click').on('click', function(){
            $replyClose.parents('.reply-box').removeClass('is-open');
            $replyClose.parents('li').find('.reply-num .t-btn').removeClass('act');
            return false;
        });
    }

    function clipUrl(o){
        var target = o.data("clipboard-target");
        var IE=(document.all) ? true : false;
        if (IE) {
            if(confirm("주소를 복사하시겠습니까?"))
                window.clipboardData.setData("Text", $(target).text());
        } else {
            var temp = prompt("Ctrl+C를 눌러 클립보드로 복사하세요", $(target).text());
        }
    }

    function menu(){
        var $ele= $('.menu-box'), $btn = $('.bt-all-menu, .bt-all-close');
        $btn.off('click').on('click', function(){$ele.toggleClass('is-active');});

        var $sch= $('.h-search-box'), $schBtn = $('.bt-search-open'), $schBackBtn = $('.bt-search-back'), $schGoBtn = $('.bt-search');
        //$schBtn.off('click').on('click', function(){$('#wrap').toggleClass('sch-is-active');});

        $schBackBtn.off('click').on('click', function(){history.back()});
        $schBtn.off('click').on('click', function(){location.href = '/search/'});
        $schGoBtn.off('click').on('click', function(){searchBtn();});

        $('.bt-back').on('click',function () {
            history.back();
        });
    }

    function radioTog(){
        if($('input[type="radio"]').filter('[data-tog-idx]').length==1){return;}

        var target = $('input[type="radio"]').filter('[data-tog-idx]:checked');
        $('.'+target.data('tog-target')).hide().filter('[data-tog-box="'+ target.data('tog-idx') +'"]').show();

        $('input[type="radio"]').filter('[data-tog-idx]').off('click').on('click', function(){
            $('.'+$(this).data('tog-target')).hide().filter('[data-tog-box="'+ $(this).data('tog-idx') +'"]').show();
        });
    }

    /**
     * @param res
     * @param res.resultData
     * @param res.code
     * @param res.message
     */

    function loveBtnAct(){
        $(document).off('click').on('click', '.btn-love', function(){
            var $this = $(this);
            $.ajax({
                url: '/ranking/addLoveCount?artistIdx=' + $('.subscript').data("artistidx"),
                type: 'GET',
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                }
            }).done(function (res) {
                // TODO result로 성공/실패 데이터를 받아서 아래 이펙트를 제어하고, 페이지에 사랑해요 real과 total 수치를 +1 해준다.
                // TODO +1 수치 증가 대신 사랑해요 반영시 해당 아티스트의 today, total 사랑해요 값을 다시 가져와서 적용시켜주는것이 어떠할까?
                var resError = res.code;
                var resMsg = res.message;
                console.log('loveBtnAct result Code : '+resError);

                if(resError === 'FAIL') {
                    alert(resMsg);
                } else {
                    $this.addClass('click');
                    var todayLoveCount = $('#todayLoveCount').text()*1;
                    var totalLoveCount = $('#totalLoveCount').text()*1;
                    $('#todayLoveCount').text(todayLoveCount + 1);
                    $('#totalLoveCount').text(totalLoveCount + 1)
                    setTimeout(function(){$this.addClass('act');}, 200);
                    setTimeout(function(){$this.removeClass('click act');}, 1200);
                }
            });

        });
    }

    function init(){
        controlTab();
        toggleList();
        tabs();
        comment();
        menu();
        radioTog();
        loveBtnAct();

        // dev
        mainBoardList();

        joinCertify();
        joinFormValidation();
        mypageBtn();

        searchMoreBtn();
        listTenMoreBtn();
        headerTopLoginBtn();
        qnaToggleList();

        replyBtnControl();
        initBoard();

        enterPress();
        snsShare();


        initSearchPage();
        loadCalendar();

        mainVisual();
    }
    return {init:init, tabs:tabs, comment:comment, clipUrl:clipUrl}
})();