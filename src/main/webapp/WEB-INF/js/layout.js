var layout = (function ($) {
    function include(){
        $.when(
            $.ajax({
                url : "../inc/header.html",
                beforeSend: function(){if($('#header-wrap').length==1){return true;}else{return false;}},
                success : function(result){$('#header-wrap').html(result);},
            }),
            $.ajax({
                url : "../inc/footer.html",
                beforeSend: function(){if($('#footer-wrap').length==1){return true;}else{return false;}},
                success : function(result){$('#footer-wrap').html(result);},
            }),
            $.ajax({
                url : "../inc/popup.html",
                beforeSend: function(){if($('#popup-wrap').length==1){return true;}else{return false;}},
                success : function(result){$('#popup-wrap').html(result);}
            })
        ).done(function(){
            layout.menu();
        });
    }

    function menu(){
        var nav = $(".nav"), dep1 = nav.find(".inner-wrap > ul > li");
        nav.removeClass("on");
        dep1.removeClass("on").off("click keyup mouseenter mouseleave blur").find(">a").off("click keyup mouseenter mouseleave blur").parent().parent().off("blur");
        dep1.find(">a").parent().parent().on("mouseenter keyup", function(){
            $(this).addClass("on").siblings().removeClass("on");
            nav.addClass("over");
        }).on("mouseleave", function(){
            $(this).removeClass("on").siblings().removeClass("on");
            nav.removeClass("over");
        }).parent().find(">li:last-child li:last-child a:last-child").on("blur",function(){
            $(this).parent().parent().parent().removeClass("on").siblings().removeClass("on").parent().attr("style","");
            nav.removeClass("over");
        });

        /* sub dep setting */
        var currentMenu = $('#wrap').data('dep1');
        $('[data-dep1-set="'+ currentMenu +'"]').addClass('cur');

        var myinfo = $('.my-info'), myTogLayer = $('.my-tog-layer');
        myinfo.find('.bt-mypage').off('click').on('click', function(){myTogLayer.toggleClass('is-open');});
        $('body').off('click').on('click', function(e){
            if(myTogLayer.hasClass('is-open') && !myinfo.has(e.target).length){
                myTogLayer.removeClass('is-open');
            }
        });

        $('#container').css('min-height',$(window).height()-$('header').height()-$('footer').height());
    }

    function init(){
        if($('header').length==1){layout.menu();}
        //include();
    }
    return {menu:menu, init:init}
})(jQuery);

var rankingUi = (function ($){
    function fixedRanking(){
        scPosition();
        $(window).on('scroll resize', scPosition);
        $('.ranking-scroll .in').mCustomScrollbar({autoHideScrollbar:true, mouseWheelPixels: 100, scrollInertia: 100, callbacks:{onScroll:function(){myCustomFn(this);}}});
    }
    function myCustomFn(el){/*console.log(el.mcs.top);*/}
    function scMove(e){
        var $eleGroup = $('.ranking-scroll .ranking-list'), current = $eleGroup.find('.sel');
        var $ele = e.parent(), curNum = 0;
        console.log('scMove'+current.data('idx')+'current index : '+current.index()+'ele index : '+$ele.index());
        if(current.index() != $ele.index()){
            //curNum = $ele.index();
            //$ele.addClass('sel').siblings().removeClass('sel');

            // 리스트 선택시 타겟 yes
            var rankingData = $('.ranking-data-sec');
            rankingData.data('target',$ele.data('idx'));
            if(rankingData.data('type') == 'sound') {
                rankingData.data('idx2',$ele.data('idx2'));
                rankingData.data('idx3',$ele.data('idx3'));
            }
            targetInit();

            /*setTimeout( function () {
                $('.ranking-scroll .in').mCustomScrollbar('scrollTo', function(){
                    return curNum<=1 ? 0 : $ele.prev().position().top+2;
                });
            }, 100);*/
        }
    };
    function scPosition(){
        var $ele = $('.ranking-data-sec');
        var posT = $ele.offset().top;
        var posT2 = $ele.outerHeight(true, true) + $ele.offset().top;
        var $scrollEle = $ele.find('.ranking-scroll');

        var $tab = $('.tab-fixed');
        var tPosT = $tab.offset().top;
        var $tabScrollEle = $tab.find('.tab.ty4');
        var tH = $tabScrollEle.height();

        var scroll = $(window).scrollTop(), scrollL = $(window).scrollLeft(), winH = $(window).height(), posW = $(window).width();

        /* 리스트 */
        var tabFix = $tabScrollEle.hasClass('is-fixed') ? tH : 0;
        var tabFix2 = $scrollEle.hasClass('is-fixed') && $tabScrollEle.hasClass('is-fixed') ? tH : 0;
        if(scroll>posT){
            scroll = $(window).scrollTop();
            $scrollEle.addClass('is-fixed');
            if(scroll+winH > posT2){$scrollEle.css({'height':(posT2-scroll-tabFix)+'px', 'top':tabFix+'px'});}else{$scrollEle.css({'height': '','top':tabFix2});}
        }else{
            $scrollEle.removeClass('is-fixed').css({'height': (scroll+winH-posT-tabFix)+'px', 'top':tabFix2});
        }

        /* 탭 */
        if(scroll>tPosT){$tabScrollEle.addClass('is-fixed');}else{$tabScrollEle.removeClass('is-fixed');}

        /* 가로 */
        if(posW<1080){
            if($scrollEle.hasClass('is-fixed')){
                $scrollEle.addClass('sw').css({'left': -scrollL+'px'});}else{$scrollEle.removeClass('sw').css({'left': ''});
            }
            if($tabScrollEle.hasClass('is-fixed')){
                $tabScrollEle.addClass('sw').css({'left': -scrollL+'px'});}else{$tabScrollEle.removeClass('sw').css({'left': ''});
            }
        }
    }
    function reSet(){
        scPosition();
        $(window).off('scroll resize').on('scroll resize', function(){scPosition();});
    }
    function init(){
        if($('.ranking-scroll').length==0){return;}
        fixedRanking();
    }
    return {scMove:scMove, init:init, reSet:reSet}
})(jQuery);

var popup = (function($){
    function close(e){
        e.hide();
    }
    function baseClose(){
        $('[data-pop-act=close]').off('click').on('click', function(){
            $(this).parents('.layer-pop').hide();
            return false;
        });
    }
    function open(e){
        $(e.data('target')).show();
        baseClose();
    }
    function openTarget(e){
        e.show();
        baseClose();
    }
    return {open:open, close:close, openTarget:openTarget}
})(jQuery);

function rankingChart(ele, yLabel, xLabel, vData, min, max, term){
    var  $xLabel =xLabel, $yLabel =yLabel, $rData = vData, $min = min, $max = max;
    var dom = document.getElementById(ele);
    var myChart = echarts.init(dom);
    var lineData = new Array;

    for(var i=0; i<$yLabel.length ;i++){
        lineData.push({
            name:$yLabel[i],
            type:'line',
            symbol: 'none',
            smooth: true,
            z:($rData[i].zindex == undefined ? 1 : $rData[i].zindex),
            itemStyle : {
                normal: {
                    color: $rData[i].color,
                    lineStyle: {width: ($rData[i].borderWidth == undefined ? 1 : $rData[i].borderWidth)}
                },
            },
            data:$rData[i].data,
            markPoint : {
                symbol : 'circle',
                symbolSize : 12,
                itemStyle : {
                    normal : {
                        label : {show: false}
                    }
                },
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        });
    }

    var showTooltip = true;
    if(term == 'month' || term == 'year') {
        showTooltip = false;
    }

    var option = {
        tooltip: {
            show:showTooltip,
            trigger: 'axis',
            backgroundColor : '#fff',
            borderColor : '#000',
            borderRadius : 0,
            borderWidth: 1,
            padding: 10,
            textStyle : {color: '#000', decoration: 'none', fontFamily: 'Noto Sans KR', fontSize: 12}
        },
        legend: {
            data: $yLabel,
            itemGap : 48,
            itemWidth : 30,
            itemHeight: 20,
            textStyle : {color: '#000', decoration: 'none', fontFamily: 'Noto Sans KR', fontSize: 16}
        },
        grid: {left: '24px', right: '30px', top: '55px', bottom: '15px', containLabel: true, borderColor: '#fff'},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: $xLabel,
            axisLine : {show: true, lineStyle: {color: '#999'}},
            axisLabel : {show:true, margin: 23, textStyle: {color: '#000', fontFamily: 'Noto Sans KR', fontSize: 12}},
            splitLine : {show:true, lineStyle: {color: '#e5e5e5'}},
        },
        yAxis: {
            type: 'value',
            min: $min,
            max: $max,
            splitNumber: 2,
            axisLine : {show: true, lineStyle: {color: '#999'}},
            axisLabel : {show:true, margin: 19, textStyle: {color: '#000', fontFamily: 'Noto Sans KR', fontSize: 14}},
            splitLine : {show:true, lineStyle: {color: '#e5e5e5'}},
        },
        series: lineData
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    window.addEventListener('resize', function(){myChart.resize();})
}

function loading(f){
    if(f==true){
        $('body').append('<aside class="loading-wrap"><div class="out"><p class="in"><em class="loading-grp"><i class="loading"></i><span class="loading-text">loading</span></em></p></div></aside>');
        $('.loading-wrap').addClass('is-act');
    }else{
        $('.loading-wrap').removeClass('is-act');
        $('.loading-wrap').remove();
    }
}
/*
if (navigator.userAgent.match(/iPhone/) || navigator.userAgent.match(/iPad/) || navigator.userAgent.match(/Android/)) {
    location.replace('http://m.template.hart.com/');
}
layout.init();
layout.menu();
*/


