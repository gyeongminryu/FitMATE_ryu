<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<head>
  <meta charset="UTF-8">

  <style>

    /*전체 페이지에 스크롤 없애는 법*/
    html, body {
      overflow: hidden; /* 스크롤 숨기기 */
      height: 100%; /* 페이지 전체 높이를 설정 */
      margin: 0; /* 기본 마진 제거 */
      background-color: rgba(40, 43, 52, 1);
    }

    .Question_page {
      margin-left: 226px;
      margin-top: 103px;
      width: 500px;
      height: 510px;
    }

    #title {
      display: flex;
      flex-direction: row;
    }

    .b_title {
      font-weight: bold;
      font-size: 25px;
    }

    .s_title {
      margin-top: 10px;
    }

    #line {
      margin-top: 40px;
      margin-bottom: 20px;
    }

    .line_fixed {
      width: 500px;
      border: 0.5px solid rgba(4, 129, 135, 1);
    }

    .line_move {
      /* 고도화 : 헬스 mbti 테이블의 질문 수 세어서, 총 길이를 질문 수로 나눈 다음.. getElementClass('line_moved'), lineElement.style.width = lineLength 가져와서 바꾸기*/
      width: 83px;
      height: 5px;
      background-color: rgba(4, 129, 135, 1);
    }

    #main_Question {
      font-weight: bold;
      margin: 20px 0px;
    }

    #main_option {
      margin: 30px 0px;
    }
    .loading_context{
      width: 480px;
      height: 250px;
      font-size: 29px;
      font-weight: 800;
      text-align: center;
      padding: 100px;
    }
    .option {
      width: 480px;
      height: 53px;
      background-color: rgba(40, 43, 52, 1);
      margin: 10px 3px;
      padding: 15px 10px 10px 10px;
      border-radius: 5px;
    } /*클릭 이벤트의 옵션은 초록색으로 바뀌도록*/

    #prev_next_div {
      display: flex;
      flex-direction: row;
    }

    /*.prev {*/
    /*	width: 220px;*/
    /*	height: 50px;*/
    /*	border-radius: 5px;*/
    /*	background-color: rgba(233, 236, 239, 1);*/
    /*	padding: 15px 10px 10px 10px;*/
    /*	color: rgba(40, 43, 52, 1);*/
    /*	font-weight: bold;*/
    /*	text-align: center;*/
    /*}*/

    .next {
      color: white;
      width: 220px;
      height: 50px;
      border-radius: 5px;
      background-color: rgba(4, 129, 135, 1);
      padding: 15px 10px 10px 10px;
      font-weight: bold;
      text-align: center;
    }
  </style>

</head>

<body>
<div class="container">
  <c:import url="layout/leftnav_1.jsp"></c:import>
  <!-- 운동일지는 nav1로, mbti만 nav5로 -->
  <div class="contents">

    <div class="Question_page">
      <div id="title">
        <div class="b_title">헬스 MBTI</div>
        &nbsp;&nbsp;
        <div class="s_title">검사하기</div>
      </div>
      <div id="line">
        <div class="line_fixed"></div>
        <div class="line_move"></div>
        <!-- 다음 페이지 버튼 누르면 이동하게 하기-->
      </div>
      <div id="Question_div">
        <div id="main_Question"></div>
        <div id="main_option">
          <div class = "loading_context">잠시만 기다려주세요!</div>

        </div>
      </div>

      <div id="prev_next_div">
        <!--이미지로 넣기-->
        <%--<div class="next" onclick="load_nextPage(currentQuestionIdx)">다음 질문 →</div>--%>

        <form action="mbti_r.go" method="get" type = hidden>
          <input type = "button" class="next" value="← 이전 질문" onclick="load_prev_Page(currentQuestionIdx)">

          <input type = "button" class="next" value="다음 질문 →" onclick="load_nextPage(currentQuestionIdx)">
        </form>

        <!--이미지로 넣기-->
      </div>
    </div>
  </div>
</div>
<c:import url="layout/modal.jsp"></c:import>
</body>

<script src="resources/js/common.js"></script>
<script src="resources/js/mbti_q.js"></script>
<script>
  //첫 페이지 들어올 때
  let isInitialLoad = true;

  //현재 페이지 질문 idx 값
  let currentQuestionIdx = 0;

  //최소 idx 값 가져오기
  let minQuestionIdx = 0;

  //다음 질문 idx
  let nextPageidentifier = 1;

  //선택한 값이 있을 때
  let selectedScore = {};

  let scores = {}; //여기는 let scores = new scores();
</script>
</html>