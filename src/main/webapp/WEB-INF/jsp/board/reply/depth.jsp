<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<c:choose>
    <c:when test="${replyListDepth == null}">
        <%--대댓글 하나도 없을때--%>
        <div class="item">
            <div class="write-row">
                <input placeholder="답글을 작성하세요" />
                <button class="t-btn ty11">등록</button>
            </div>
        </div>
    </c:when>
    <c:otherwise>
        <%--대댓글이 있을때--%>
        <c:forEach items="${replyListDepth}" begin="0" end="3" step="1" var="replyVO" varStatus="status">
            <c:choose>
                <c:when test="${replyVO.content ne ''}">
                    <%--기본형 대댓글--%>
                    <div class="item">
                        <p class="info"><strong class="name">${replyVO.writer}</strong><span class="time">${replyVO.reg_ymdt}</span></p>
                        <p class="subject">${replyVO.content}</p>
                        <c:if test="${userInfo.email eq replyVO.email || userInfo.email eq 'admin'}">
                            <%--TODO 수정버튼에 해당하는 폼이 있어야 하는데 없다. 댓글처럼 대댓글도 비슷한 방식을 써도 좋긴 하겠다.--%>
                            <div class="fun-btn"><a href="#" class="t-btn ty10">수정</a></div>
                            <div class="fun-btn"><a href="#" class="t-btn ty10">삭제</a></div>
                        </c:if>
                    </div>
                </c:when>
                <c:otherwise>
                    <%--삭제된 대댓글--%>
                    <div class="item del">
                        <p class="info"><strong class="name">홍길동</strong></p>
                        <p class="subject">작성자에 의해 삭제된 댓글입니다. </p>
                    </div>
                </c:otherwise>
            </c:choose>
        </c:forEach>

    </c:otherwise>
</c:choose>