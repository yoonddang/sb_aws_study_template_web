<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<h3 class="tit ty1"><span>���<em id="replyCount">${result.replyCount == null ? 0 : result.replyCount}</em></span></h3>
<div class=""></div>
<div class="write-row">
    <form id="replyInsertForm" name="replyInsertForm" role="form" action="post">
        <input type="hidden" id="idx" name="idx" value="${idx}"/>
        <input type="hidden" id="insertEmail" name="email" value="${userInfo.email}"/>
    <textarea id="insertContent" name="content" placeholder="���۱� �� �ٸ� ����� �Ǹ��� ħ���ϰų� ���� �Ѽ��ϴ� �Խù��� �̿��� �� ���� ������ ���� ���縦 ���� �� �ֽ��ϴ�. ������ ��й�ȭ�� ������ ��� ��ȭ�� ����, Ÿ�ο��� ���谨�� �ִ� �弳 �Ǵ� Ư�� ����/����, ���� ���� �����ϴ� �ܾ���� ǥ�ð� ���ѵ˴ϴ�." ></textarea>
    <%--<p class="word-count">0/<strong>300</strong></p>--%>
    </form>
    <a href="#" class="t-btn ty5" id="insertReplyBtn">���</a>
</div>

<%--����� ���� ���� �ʴ� ��� ���� ���� --%>
<ul class="comment-list">
    <c:forEach items="${result.replyList}" var="replyVO" varStatus="status">
        <li>
                <%--�⺻�� ���--%>
            <form id="replyUpdateForm" name="replyUpdateForm" role="form" action="post">
                <p class="info"><strong class="name">${replyVO.email eq 'admin@TEMPLATE.com' ? '������' : replyVO.writer}</strong><span class="time">${replyVO.reg_ymdt}</span></p>
                <input type="hidden" id="updateEmail" name="email" value="${userInfo.email}"/>
                <div class="subject">
                    <p>${replyVO.content}</p>
                    <c:if test="${userInfo.email == replyVO.email}">
                        <div class="write-row">
                            <input type="hidden" id="reply_idx" name="reply_idx" value="${replyVO.reply_idx}"/>
                            <textarea id="updateContent" name="content">${replyVO.content}</textarea>
                            <%--<p class="word-count">0/<strong>300</strong></p>--%>
                            <a href="#" id="updateReplyBtn" onclick="$(this).parents('.subject').removeClass('act-edit'); return false;" class="t-btn ty11">����</a>
                        </div>
                    </c:if>
                </div>

                    <%--<div class="reply-num"><a href="#" class="t-btn ty7">��� <strong>123</strong></a></div>--%>
            </form>
            <c:if test="${userInfo.email eq replyVO.email || userInfo.email eq 'admin'}">
            <span class="fun-btn">
                      <a href="#" data-btn-act="modify" class="t-btn ty7">����</a>
                      <a href="#" data-btn-act="delete" class="t-btn ty7">����</a>
                    </span>
            </c:if>
        </li>
    </c:forEach>
</ul>
<div class="btn-more-row"><a href="#" class="t-btn bt-more-bar" id="replyMoreBtn" data-idx="${idx}" data-maxreorder="${result.maxReorder}"
                             data-length="${result.length}">��ü ��� ������</a></div>
