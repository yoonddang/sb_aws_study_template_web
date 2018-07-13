"use strict";
//require
var module = {
    baseUrl: '/js/',
    waitSeconds: 200,
    paths: {
        'jquery' : 'libs/jquery',
        'slick' : 'libs/slick.min',
        'cusScroll' : 'libs/jquery.mCustomScrollbar.concat.min',
        'layout' : 'layout',
        'dev' : 'dev',
        'ui' : 'ui',
        'join' : 'join',
    },
    //의존성 관리 라이브러리 플러그인 별 의존성 추가
    shim:{
        //'slick':{deps:['jquery']},
        'TweenMax':{deps:['jquery']},
        'cusScroll':{deps:['jquery']},
        'layout':{deps:['cusScroll']},
        'dev':{deps:['layout', 'join']},
        'ui':{deps:['slick', 'layout']},
    }
};

//설정 호출 함수
function startJs () {
    requirejs.config(module);
};
