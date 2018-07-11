<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<article class="inner-wrap">
    <h3><em>TEMPLATE</em><span>NOTICE</span><a href="/board/list/1" class="t-btn bt-more">더보기</a></h3>
    <div class="list-ty1">
        <table>
            <colgroup>
                <col width="162px"/>
                <col width="*"/>
                <col width="123px"/>
            </colgroup>
            <thead>
            <tr>
                <th>구분</th>
                <th class="left">내용</th>
                <th>날짜</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach items="${result.boardList}" begin="0" end="5" step="1" var="data" varStatus="status">
                <tr data-index="${searchVO.totRow-((searchVO.page-1)*searchVO.displayRowCount + status.index)}">
                    <td><span class="flag">${data.category}</span></td>
                    <td class="left"><a href="/board/one/${category}?boardIdx=${data.board_idx}" class="subject">${data.title}</a></td>
                    <td>${data.reg_ymdt}</td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </div>
</article>