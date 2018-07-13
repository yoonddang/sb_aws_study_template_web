<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<title>TEMPLATE</title>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0"/>
	<meta name="format-detection" content="telephone=no"/>

	<meta name="naver-site-verification" content="93e47e599ad7ccfb4131e106ff4540f1631a7b78"/>
	<meta name="description" content="TEMPLATE">
	<meta property="og:title" content="TEMPLATE">
	<meta property="og:description" content="TEMPLATE">
	<meta property="og:image" content="/img/og-image.jpg">
	<meta property="og:url" content="http://www.TEMPLATE.com">

	<%-- 리소스 --%>
	<link rel="stylesheet" type="text/css" href="/css/common.css?ver=${cssModDate}">
	<link rel="stylesheet" type="text/css" href="/css/dep.css">
</head>
<body>


<div id="wrap" class="${isLogin ? 'login-state-yes' : 'login-state-no'} <tiles:insertAttribute name="wrap" />">
	<div id="<tiles:insertAttribute name="header-wrap" />">
		<tiles:insertAttribute name="header" />
	</div>

	<div id="container" class="<tiles:insertAttribute name="container" />">
		<tiles:insertAttribute name="content" />
	</div>

	<div id="footer-wrap">
		<tiles:insertAttribute name="footer" />
	</div>
</div>
<%--
<div id="popup-wrap">
	<tiles:insertAttribute name="popup" />
</div>
--%>



<script type="text/javascript" src="/js/require.config.js?ver=${cssModDate}" ></script>
<script type="text/javascript" data-main="/js/ui.js" src="/js/libs/require.js?ver=${cssModDate}" ></script>


</body>
</html>