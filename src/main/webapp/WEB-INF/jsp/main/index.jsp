<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<div id="contents">
    <section class="m-visual">
        <div class="slider">
            <%--
                      <div><a href="${bannerList.url}" target="_blank" style="background: #02f802 url('${bannerList.image}') 50% 0;"></a></div>
                      --%>

            <%--<div><a href="/board/one/1?boardIdx=130" style="background: #02f802 url('/img/main/top_event_001.jpg') 50% 0;"></a></div>--%>
            <div><a href="/ranking/" style="background: #02f802 url('/img/main/top_event_001.jpg') 50% 0;"></a></div>
            <div><a href="http://gpromotion.gmarket.co.kr/Plan/PlanView?sid=160374" target="_blank" style="background: #02f802 url('/img/main/top_event_002.jpg') 50% 0;"></a></div>
            <%--<div><a href="/board/one/1?boardIdx=142" style="background: #02f802 url('/img/main/top_event_003.jpg') 50% 0;"></a></div>--%>
            <div><a href="/ranking/?type=star" style="background: #02f802 url('/img/main/top_event_004.jpg') 50% 0;"></a></div>
            <%--<div><a href="https://www.facebook.com/riakmusic" target="_blank" style="background: #02f802 url('/img/main/top_event_005.jpg') 50% 0;"></a></div>--%>
            <%--<div><a href="https://blindmusician.co.kr/" target="_blank" style="background: #02f802 url('/img/main/top_event_006.jpg') 50% 0;"></a></div>--%>

        </div>
    </section><!-- end : .m-visual -->

    <section class="m-ranking-group">
        <div class="inner">
            <section class="m-ranking-sec">
                <article class="tab ty1 is-control">
                    <ul data-current="1" data-fun="main-ranking">
                        <li data-value="1"><a href="#" class="act">음반랭킹</a></li>
                        <li data-value="2"><a href="#">음원랭킹</a></li>
                        <li data-value="3"><a href="#">뮤직랭킹</a></li>
                        <li data-value="4"><a href="#">스타랭킹</a></li>
                        <li data-value="5"><a href="#">크라운차트</a></li>
                    </ul>
                </article>
                <article class="ajax-data-ranking">
                    <!-- .ajax-data-ranking 에 main/ranking.html 파일을 불러옴. dev.js에 tabDataAct(type:main-ranking)에서 실행.   -->
                </article>
            </section><!-- end : .m-ranking-sec -->

            <section class="ad-banner">
                <div class="slider">
                    <div><a href="http://gpromotion.gmarket.co.kr/Plan/PlanView?sid=159905" target="_blank"
                            style="background: #02f802 url('/image/banner_middle_gmarket.jpg') 50% 0;"></a></div>
                    <%--<div><a href="http://kpoptown.com/" target="_blank"
                            style="background: #02f802 url('/image/banner_middle_kpopmart01.gif') 50% 0;"></a></div>--%>
                    <%--<div><a href="http://www.aladin.co.kr/" target="_blank"
                            style="background: #02f802 url('/image/banner_middle_aladin01.jpg') 50% 0;"></a></div>--%>
                </div>
            </section><!-- end : ad-banner -->

        </div>
    </section>

    <section class="m-notice">

    </section><!-- end : .m-notice -->


</div>