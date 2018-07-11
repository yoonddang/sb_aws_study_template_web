<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<h3 class="tit ty1"><span>댓글<em id="replyCount">${result.replyCount == null ? 0 : result.replyCount}</em></span></h3>
<div class=""></div>
<div class="write-row">
    <form id="replyInsertForm" name="replyInsertForm" role="form" action="post">
        <input type="hidden" id="idx" name="idx" value="${idx}"/>
        <input type="hidden" id="insertEmail" name="email" value="${userInfo.email}"/>
    <textarea id="insertContent" name="content" placeholder="저작권 등 다른 사람의 권리를 침해하거나 명예를 훼손하는 게시물은 이용약관 및 관련 법률에 의해 제재를 받을 수 있습니다. 건전한 토론문화와 양질의 댓글 문화를 위해, 타인에게 불쾌감을 주는 욕설 또는 특정 계층/민족, 종교 등을 비하하는 단어들은 표시가 제한됩니다." ></textarea>
    <%--<p class="word-count">0/<strong>300</strong></p>--%>
    </form>
    <a href="#" class="t-btn ty5" id="insertReplyBtn">등록</a>
</div>

<%--댓글이 존재 하지 않는 경우 예외 영역 --%>
<ul class="comment-list">
    <c:forEach items="${result.replyList}" var="replyVO" varStatus="status">
        <li>
                <%--기본형 댓글--%>
            <form id="replyUpdateForm" name="replyUpdateForm" role="form" action="post">
                <p class="info"><strong class="name">${replyVO.email eq 'admin@TEMPLATE.com' ? '관리자' : replyVO.writer}</strong><span class="time">${replyVO.reg_ymdt}</span></p>
                <input type="hidden" id="updateEmail" name="email" value="${userInfo.email}"/>
                <div class="subject">
                    <p>${replyVO.content}</p>
                    <c:if test="${userInfo.email == replyVO.email}">
                        <div class="write-row">
                            <input type="hidden" id="reply_idx" name="reply_idx" value="${replyVO.reply_idx}"/>
                            <textarea id="updateContent" name="content">${replyVO.content}</textarea>
                            <%--<p class="word-count">0/<strong>300</strong></p>--%>
                            <a href="#" id="updateReplyBtn" onclick="$(this).parents('.subject').removeClass('act-edit'); return false;" class="t-btn ty11">수정</a>
                        </div>
                    </c:if>
                </div>

                    <%--<div class="reply-num"><a href="#" class="t-btn ty7">답글 <strong>123</strong></a></div>--%>
            </form>
            <c:if test="${userInfo.email eq replyVO.email || userInfo.email eq 'admin'}">
            <span class="fun-btn">
                      <a href="#" data-btn-act="modify" class="t-btn ty7">수정</a>
                      <a href="#" data-btn-act="delete" class="t-btn ty7">삭제</a>
                    </span>
            </c:if>
        </li>
    </c:forEach>
</ul>
<div class="btn-more-row"><a href="#" class="t-btn bt-more-bar" id="replyMoreBtn" data-idx="${idx}" data-maxreorder="${result.maxReorder}"
                             data-length="${result.length}">전체 댓글 더보기</a></div>
