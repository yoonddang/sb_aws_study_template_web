<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="contents">
    <section class="sub-visual-sce">
        <article class="inner-wrap">
            <div class="tx-group" id="boardTitle">
                <h2>${searchVO.category}</h2>
                <p><span></span></p>
            </div>
            <div class="eng-txt">TEMPLATE<br/>NOTICE</div>
        </article>
    </section><!-- end : .sub-visual-sce -->

<c:if test="${category eq 2}">
    <section class="tab ty3">
        <article class="inner-wrap">
            <ul>
            </ul>
        </article>
    </section>
</c:if>

    <section class="content-inner-wrap">
        <!-- ------------------------------------------------------------------------------------------------------------ -->
        <article class="board-data-group">
            <fieldset class="search-filter">
                <c:if test="${category >= 5}">
                    <a href="/board/form/${category}" class="t-btn ty6 s2">글쓰기</a>
                </c:if>
                <c:if test="${category eq 1 && userAuthority.role eq 999}">
                    <a href="/board/form/1" class="t-btn ty6 s2">글쓰기</a>
                </c:if>
                <%--<select>
                    <option>제목 + 내용</option>
                </select>
                <input type="text"/>
                <a href="#" class="t-btn ty8 s2">검색</a>--%>
            </fieldset>
            <section class="list-ty2">
                <table class="base">
                    <colgroup>
                        <col width="176px"/>
                        <col width="*"/>
                        <col width="196px"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>날짜</th>
                        <th>내용</th>
                        <th>작성자</th>
                    </tr>
                    </thead>
                    <tbody id="boardList">
                    <c:forEach items="${result.boardList}" begin="0" end="${result.boardCount}" step="1" var="data" varStatus="status">
                        <tr data-index="${searchVO.totRow-((searchVO.page-1)*searchVO.displayRowCount + status.index)}"
                            data-category="${data.category}">
                            <td class="center">${data.reg_ymdt}</td>
                            <c:choose>
                                <c:when test="${category eq 6}">
                                    <c:choose>
                                        <c:when test="${data.writer eq userInfo.nickname || userInfo.nickname eq '관리자'}">
                                            <td><p class="link"><a href="/board/one/${category}?boardIdx=${data.board_idx}">${data.title} </a></p></td>
                                        </c:when>
                                        <c:otherwise>
                                            <td><p class="link"><a href="#" onclick="alert('접근 권한이 없습니다.');">${data.title}</a></p></td>
                                        </c:otherwise>
                                    </c:choose>
                                </c:when>
                            <c:otherwise>
                                <td><p class="link"><a href="/board/one/${category}?boardIdx=${data.board_idx}">${data.title}</a></p></td>
                            </c:otherwise>
                            </c:choose>
                            <td class="center">${data.writer}</td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
                <article class="btn-more-row board-more">
                    <a href="#" class="t-btn bt-more-bar" data-category="${category}" data-count="${result.boardCount}" data-user="${userInfo.nickname}">더보기</a>
                </article>
            </section>

            <%--<section class="ad-banner"><a href="#"><img src="/img/common/ad-banner.jpg" alt=""/></a>
            </section><!-- end : ad-banner -->--%>
        </article><!-- end : awards-data-group -->
        <!-- ------------------------------------------------------------------------------------------------------------ -->
    </section>
</div>

