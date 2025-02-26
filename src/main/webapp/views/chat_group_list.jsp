<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://getbootstrap.com/docs/5.2/assets/css/docs.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src = "https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <title></title>
  <link href="resources/css/chat_group_list.css" rel="stylesheet" type="text/css"/>

</head>

<body>
<div class="chat_modal_box">
  <div class="nick" hidden="hidden">${nick_name}</div>
  <div class="chat_modal">
    <div class="chat_modal_top_bar chat_modal_bar"></div>
    <div class="chat_group_list">
      <c:forEach items="${crew_chat_grp}" var="crew_grp">
      <!-- 크루명 or 사람 이름 -->
      <div class="chat_group_entity" onclick="window.location.href='chat_list.go?chat_group_idx=${crew_grp.chat_group_idx}&chat_group_name=${crew_grp.chat_name}'">
        <div class="chat_group_entity_grp_idx" hidden="hidden">${crew_grp.chat_group_idx}</div>
        <div class="chat_group_entity_top">
          <div class="chat_group_name">${crew_grp.chat_name}</div>
          <div class="chat_group_lastdate">${crew_grp.last_chat_time}</div>
        </div>
        <div class="chat_group_entity_bottom">
          <div class="chat_group_lastmsg">${crew_grp.last_chat}</div>
          <div class="chat_group_member">1명</div>
        </div>
      </div>
      </c:forEach>
      <c:forEach items="${member_chat_grp}" var="member_grp">
        <!-- 크루명 or 사람 이름 -->
        <div class="chat_group_entity" onclick="window.location.href='chat_list.go?chat_group_idx=${member_grp.chat_group_idx}&chat_group_name=${member_grp.chat_name}'">
          <div class="chat_group_entity_grp_idx" hidden="hidden">${member_grp.chat_group_idx}</div>
          <div class="chat_group_entity_top">
            <div class="chat_group_name">${member_grp.chat_name}</div>
            <div class="chat_group_lastdate">${member_grp.last_chat_time}</div>
          </div>
          <div class="chat_group_entity_bottom">
            <div class="chat_group_lastmsg">${member_grp.last_chat}</div>
            <div class="chat_group_member">1명</div>
          </div>
        </div>
      </c:forEach>
    </div>
  </div>
</div>
</body>
<script src="resources/js/chat_websocket.js"></script>
</html>