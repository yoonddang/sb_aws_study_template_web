<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="container">
    <div class="login_container">
        <div class="inner">
            <div class="login_box">
                <div class="id_box">

                    <div class="welcome">환영합니다.</div>

                    <form class="form-signin" role="form" id="login" method="POST">
                        <div class="user-data">
                        <div class="plc_wrap">


                            <label for="search" class="plc_lb"></label>
                            <input type="email" id="userEmail" name="${usernameParameter}"
                                   required placeholder="이메일 입력" class="plc_ip">
                        </div>
                        <div class="plc_wrap">
                            <label for="search" class="plc_lb"></label>
                            <input type="password" id="userPass" name="${passwordParameter}"
                                   required placeholder="비밀번호 입력" class="plc_ip">
                        </div>
                        </div>

                        <div class="plc_save">

                        </div>

                        <button type="button" id="loginBtn" class="btn_submit" data-saveurl="${saveRefererUrl}"
                                onclick="regexcheck()">
                            <span class="txt">로그인</span>
                        </button>

                    </form>
                    <div class="idpsfound">
                        <ul class="found">

                            <li>
                                <a class="color" href="/findpassword">비밀번호 찾기</a>
                            </li>
                            <li>
                                <a href="/join/certify">회원가입</a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="id_box_bottom">
                    <button type="button"  onclick="alert('준비중입니다.'); return false;" class="btn_facebook">
                        <img src="/image/ico_facebook.png" class="img"></img>
                        <span class="txt">페이스북으로 시작하기</span>
                    </button>


                    <button type="button" onclick="alert('준비중입니다.'); return false;" class="btn_google">
                        <img src="/image/ico_google.png" class="img"></img>
                        <span class="txt">구글로 시작하기</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>