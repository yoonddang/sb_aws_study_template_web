<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8" %>
<% request.setCharacterEncoding("utf-8"); %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header id="islogin" data-islogin="${isLogin}" data-role="${userAuthority.role}">
  <h1><a href="/"><img src="/img/layout/logo.png" alt="" /></a></h1>
  <nav class="nav">
    <div class="inner-wrap">
      <ul>
        <li class="m-dep m1">
          <a href="/ranking/" class="dep1" data-dep1-set="musicChart">TEMPLATE</a>
			<ul class="dep2">
				<li><a href="TEMPLATE">TEMPLATE-TEMPLATE</a></li>
			</ul>
        </li>

      </ul>
    </div>
  </nav>
	<section class="search-total">
		<article>

		</article>
	</section>
	<section class="my-info">
		<div class="inner">
			<a href="#" class="i-btn bt-mypage">TEMPLATE</a>

		</div>
	</section>
	<section class="util-group">
		<article class="inner-wrap">
			<div class="util">
				<span><a href="/login"><strong>로그인</strong></a></span>
			</div>
		</article>
	</section>
</header>