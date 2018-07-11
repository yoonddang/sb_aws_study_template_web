<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>


<link rel="stylesheet" type="text/css" href="/css/common.css?ver=${cssModDate}">

<div id="content" class="in">
	<tiles:insertAttribute name="content" />
</div>

<script type="text/javascript" src="/js/require.config.js?ver=${cssModDate}" ></script>
<script type="text/javascript" data-main="/js/ui.js" src="/js/libs/require.js?ver=${cssModDate}" ></script>