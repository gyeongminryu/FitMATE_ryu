<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>FitMATE</title>
    <link rel="stylesheet" type="text/css" href="resources/css/admin_common.css" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        var index = 8;
    </script>
</head>
<body>
<div class="container">
    <c:import url="layout/admin_leftnav.jsp" />
    <div class="right_wrapper">
        <c:import url="layout/admin_header.jsp" />
        <div class="title">
            <h2>신고 사유 관리</h2>
        </div>
        <div class="contents narrow">
            <ul class="noDesc">
                <c:forEach items="${list}" var="list">
                    <li>
                        <div class="btn_flex narrow">
                            <div class="width80p">
                                <input type="text" name="reportr_con" value="${list.reportr_con}" class="full flex_left" onblur="updateData(this, ${list.reportr_idx})" />
                            </div>
                            <div class="width20p">
                                <button onclick="deleteData(this, ${list.reportr_idx})" class="mainbtn full flex_right">삭제</button>
                            </div>
                        </div>
                    </li>
                </c:forEach>
            </ul>
            <form>
                <div class="btn_flex narrow">
                    <div class="width80p">
                        <input type="text" name="reportr_con" class="full flex_left insertData" placeholder="추가할 항목을 입력하세요." />
                    </div>
                    <div class="width20p">
                        <input type="button" value="추가" onclick="insertData()" class="mainbtn full flex_right" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<c:import url="layout/modal.jsp" />
</body>
<script src="resources/js/admin_common.js"></script>
<script src="resources/js/admin_regData.js"></script>
</html>