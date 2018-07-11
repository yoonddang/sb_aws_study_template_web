<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<c:choose>
    <c:when test="${replyListDepth == null}">
        <%--���� �ϳ��� ������--%>
        <div class="item">
            <div class="write-row">
                <input placeholder="����� �ۼ��ϼ���" />
                <button class="t-btn ty11">���</button>
            </div>
        </div>
    </c:when>
    <c:otherwise>
        <%--������ ������--%>
        <c:forEach items="${replyListDepth}" begin="0" end="3" step="1" var="replyVO" varStatus="status">
            <c:choose>
                <c:when test="${replyVO.content ne ''}">
                    <%--�⺻�� ����--%>
                    <div class="item">
                        <p class="info"><strong class="name">${replyVO.writer}</strong><span class="time">${replyVO.reg_ymdt}</span></p>
                        <p class="subject">${replyVO.content}</p>
                        <c:if test="${userInfo.email eq replyVO.email || userInfo.email eq 'admin'}">
                            <%--TODO ������ư�� �ش��ϴ� ���� �־�� �ϴµ� ����. ���ó�� ���۵� ����� ����� �ᵵ ���� �ϰڴ�.--%>
                            <div class="fun-btn"><a href="#" class="t-btn ty10">����</a></div>
                            <div class="fun-btn"><a href="#" class="t-btn ty10">����</a></div>
                        </c:if>
                    </div>
                </c:when>
                <c:otherwise>
                    <%--������ ����--%>
                    <div class="item del">
                        <p class="info"><strong class="name">ȫ�浿</strong></p>
                        <p class="subject">�ۼ��ڿ� ���� ������ ����Դϴ�. </p>
                    </div>
                </c:otherwise>
            </c:choose>
        </c:forEach>

    </c:otherwise>
</c:choose>