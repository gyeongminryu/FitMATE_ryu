<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.LocalDate" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://getbootstrap.com/docs/5.2/assets/css/docs.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src = "https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <title></title>
  <link rel="stylesheet" type="text/css" href="resources/css/chat_list.css" />
</head>

<body>

<%--오늘 날짜--%>
<%
  // 오늘 날짜를 LocalDate로 구하기
  LocalDate today = LocalDate.now();

  // 날짜 포맷 설정
  DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

  // 오늘 날짜를 문자열로 변환
  String formattedDate = today.format(formatter);

  // JSP 페이지에서 사용하기 위해 request에 저장
  request.setAttribute("today", formattedDate);
%>

<div class="chat_modal_box">
  <div class="nick" hidden="hidden">${nick_name}</div>
  <div class="chat_modal">
    <div class="chat_modal_top_bar chat_modal_bar">
      <div class="chat_group_name_selected">${chat_group_name}</div>
      <div class="chat_group_cnt_selected">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
        3명</div>
    </div>
    <div class="chat_msg_list">
      <c:forEach items="${chat_list}" var="chat_item">
        <div class="chat_group_entity_grp_idx" hidden="hidden">${chat_item.group_idx}</div>
        <div class="chat_group_participant" hidden="hidden">${chat_participant}</div>
        <div class="chat_group_cate" hidden="hidden">${group_cate}</div>
      <c:if test="${chat_item.nick eq nick_name}">
        <div class="chat_msg_box chat_msg_box_mine">
          <div class="chat_msg_mine">${chat_item.content}</div>

          <c:set var="chat_date" value="${fn:substringBefore(chat_item.sendtime, ' ')}"></c:set>

          <c:if test="${today != chat_date}">
          <div class="chat_time">${chat_item.sendtime}</div>
          </c:if>


          <c:if test="${today == chat_date}">
            <div class="chat_time">
              <c:set var="chat_time" value="${fn:substringAfter(chat_item.sendtime, ' ')}"></c:set>
              <c:set var="chat_hour" value="${chat_time.substring(0, 2)}"></c:set>

              <c:if test="${not empty chat_hour}">
                <c:set var="chat_hour_int" value="${chat_hour * 1}" /> <!-- 문자열을 정수로 변환 -->

                <c:if test="${chat_hour_int > 12}">
                오후 ${fn:substring(chat_time,0,5)}

                </c:if>
                <c:if test="${chat_hour_int <= 12}">
                  오전 ${fn:substring(chat_time,0,5)}
                </c:if>
              </c:if>
            </div>
          </c:if>
        </div>
      </c:if>

        <c:if test="${chat_item.nick ne nick_name && chat_item.nick != 'system'}">
      <div class="chat_msg_box chat_msg_box_other">
        <div class="chat_msg_other_name">${chat_item.nick}</div>
        <div class="chat_msg_other">${chat_item.content}</div>

        <c:set var="chat_date" value="${fn:substringBefore(chat_item.sendtime, ' ')}"></c:set>
        <c:if test="${today != chat_date}">
        <div class="chat_time">${chat_item.sendtime}</div>
        </c:if>

        <c:if test="${today == chat_date}">
          <div class="chat_time">
            <c:set var="chat_time" value="${fn:substringAfter(chat_item.sendtime, ' ')}"></c:set>
            <c:set var="chat_hour" value="${chat_time.substring(0, 2)}"></c:set>

            <c:if test="${not empty chat_hour}">
              <c:set var="chat_hour_int" value="${chat_hour * 1}" /> <!-- 문자열을 정수로 변환 -->

              <c:if test="${chat_hour_int > 12}">
                오후 ${fn:substring(chat_time,0,5)}
              </c:if>
              <c:if test="${chat_hour_int <= 12}">
                오전 ${fn:substring(chat_time,0,5)}
              </c:if>
            </c:if>
          </div>
        </c:if>
      </div>
      </c:if>

      <c:if test="${chat_item.nick == 'system'}">
        <div class="chat_system_alert">
            ${chat_item.content}
        </div>
      </c:if>
      </c:forEach>
    </div>
    <div class="chat_modal_bottom_bar chat_modal_bar">
      <input type="text" class="chat_enter"/>
      <button type="button" class="chat_submit_button" onclick="send_chat()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-send-arrow-down-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54L13.026 8.03A4.5 4.5 0 0 0 8 12.5c0 .5 0 1.5-.773.36l-1.59-2.498L.644 7.184l-.002-.001-.41-.261a.5.5 0 0 1 .083-.886l.452-.18.001-.001L15.314.035a.5.5 0 0 1 .54.111M6.637 10.07l7.494-7.494.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154z"/>
          <path fill-rule="evenodd" d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708z"/>
        </svg>
      </button>
    </div>
  </div>
</div>
</body>
<script src="resources/js/chat_websocket.js"></script>
<script>
  console.log('${chat_list}');
  console.log('${nick_name}');

</script>
</html>