

//페이지 시작하자마자 정보 가져오기
//최소 idx 값을 가져오는 ajax 요청부터 실행
//성공하면 받아온 currentIdx를 currentQuestionIdx와 minQuestionIdx의 전역 변수에 넣음
// 그 후 idx로 질문 및 문항 가져오는 함수 실행
window.onload = function initialLoad() {
    //초기화값 설정해줘야함...
    if (isInitialLoad) {

        $.ajax({
            type : 'GET',
            url : 'mbtiIdx.ajax',
            data : {},
            dataType : 'JSON',
            success : function(result) {
                console.log(result.idx);

                //최소 idx 가져오면 currentQuestionIdx와 minQuestionIdx에 저장하기
                currentQuestionIdx = result.idx;
                minQuestionIdx = result.idx;
                console.log(currentQuestionIdx);
                console.log(minQuestionIdx);


                //저장하고 나서 initial Load 자리 총 합산 변수 자리로 옮김
                loadQuestion(currentQuestionIdx); //idx 값을 기반으로
                drawOption(currentQuestionIdx);

            },
            error : function(e) {
                console.log(e);
            }

        });

    }else{
        loadQuestion(currentQuestionIdx);	//initialload = false면 그냥 currentQuestionIdx 가져와서 loadQuestion
    }
}

// question 불러오기 =========================================================================================
function loadQuestion(currentQuestionidx){
    $.ajax({
        type : 'GET',
        url : 'loadQuestion.ajax',
        data: {'Qidx': currentQuestionIdx},
        dataType : 'JSON',
        success : function(data){ //data 전달받기
            console.log("전체 데이터:", data);
            console.log("질문 내용:", data.questioncontent);
            console.log("질문 idx:",data.questionIdx);
            drawQuestion(data.questioncontent,data.questionIdx);
        },
        error:function(e){
            console.log(e);
        }
    });
}

function drawQuestion(questioncontent, questionIdx) {
    var mainQuestioncontent = 'Q' + questionIdx + '. ' + questioncontent;
    //질문 박스를 추가하는 부분 ==========================================
    $('#main_Question').html(mainQuestioncontent);
}

// option 불러오기 =========================================================================================

//옵션의 성향 및 점수 가져오기
function drawOption(questionIdx){ //questionIdx
    $.ajax({
        type : 'GET',
        url : 'loadOption.ajax',
        data: {'Qidx': questionIdx},
        dataType : 'JSON',
        success : function(data){ //data 전달받기
            console.log('option의 길이:',data.length);
            console.log('option data의 길이 :',data);
            console.log('제대로 뽑은건가?:',data.option[0].mbtisub_con);
            for (var i = 0; i < data.option.length; i++) { //옵션 분리
                if(i == 0 || i-1 >= 0&& data.option[i].mbtisub_con != data.option[i-1].mbtisub_con){ //옵션에서 중복된 문항 거르기 위해 사용
                    console.log('option의 idx 값:', data.option[i].idx);
                    var optioncontent = data.option[i].mbtisub_con;

                    //var optionidx= 'option'+ option[i].mbtisub_idx + '=' + option[i].mbtisub_idx; //문구 넣을 필요 없었음 수정은 아래
                    var optionidx = data.option[i].mbtisub_idx;


                    var optiondiv = '';
                    optiondiv += '<div class="option" onclick="typeScore(' + questionIdx + ',' +optionidx+ ')">' + optioncontent + '</div>'; //click하면 typeScore 함수 실행


                    //다른 버튼 클릭하면 전에 클릭했던 css 값 변경되게...
                    $(document).on('click','.option',function(){
                        $('.option').css({'backgroundColor' : 'rgba(40, 43, 52, 1)'}); //클릭하면 원래 색으로 먼저 초기화
                        $(this).css({'backgroundColor' : 'rgba(4, 129, 135, 1)'}); //클릭한 값의 색이 변함
                    });
                    console.log('optiondiv : '+ optiondiv);

                    //로딩 문구 빼는 부분 ======================================================
                    $('.loading_context').remove();


                    //option 박스를 추가하는 부분 ==========================================
                    $('#main_option').append(optiondiv);
                    // 해결 : option[i].typeScores에 있는 type들을 하나 하나 빼면서 a++을 증가시키는 형태로 type1, type2... 순차적으로 type들을 저장해줌.

                }
            }

            //끝나면 전역변수 만들어주기..
            //1. 총 점수 합산할 변수 만들기 -> let scores
            if(isInitialLoad){
                create_Totalscore();
            }
        },
        error:function(e){
            console.log(e);

        }
    });
}



//점수 합산 위한 변수 만들기
function create_Totalscore(){ //이것도 처음할 때만 하도록...
    $.ajax({
        type: 'GET',
        url: 'create_Totalscore.ajax',
        data: {},
        dataType: 'JSON',
        success: function (score) { //여기 scores랑 전역변수 scores랑 이름이 비슷해서 생긴 문제
            console.log('create_scores:', score);
            console.log('create_scores:', score.create_totalScore);
            var create_totalScore = score.create_totalScore;
            for (var type_name of create_totalScore) {
                console.log('type_name:', type_name); //받아온 성향 이름 분리
                scores[type_name] = 0; //받아온 성향 이름 : 0 을 scores 변수에 넣음
            }
            console.log('점수 합산할 변수 만들기 성공 : ', scores);

            //for (var i = 0; i < )
            isInitialLoad = false; //이후부터는 최소 idx 및 변수 설정 안되도록..

        },
        error: function (e) {
            console.log(e);
        }
    });
}



// typeScore (성향 점수) 불러오기 =========================================================================================
function typeScore(questionIdx,optionidx){ //클릭한 것만 성향과 점수 가져오는 것
    // 1. click된 버튼의 optionidx 기반으로 운동 성향과 점수 가져오기

    $.ajax({
        type : 'GET',
        url : 'get_typeScore.ajax',
        data : {'Oidx' : optionidx},
        dataType :'JSON',
        success : function (data){
            console.log('typeScore 데이터:',data);
            //typeScore 데이터 가져오기 성공
            console.log('저장된 값 있어? 1:', selectedScore);

            //조건에 따라서 얻은 점수와 성향을 전달해서 점수를 +하거나 - 하기
            //질문 1. 저장된 값이 있는가
            console.log('저장된 값의 길이: ' + Object.keys(selectedScore).length);


            if(Object.keys(selectedScore).length != 0){  //selectedScore에 값이 있는 경우, 비교하고 저장
                //★object에 저장된 값이 있는지 확인하는 것은 selecteScore 그대로 가져와서 하면 안됨..
                //★Object.keys(selectedScore).length가 0이면 없는 거고.... 그 이상이면 값이 있는 상태

                //질문 2. 현재 질문 idx 값이 있는가
                //Yes -> selectedScore에서 질문 idx값 분리해서 비교.
                if(selectedScore[questionIdx] != null) { //만약 질문 idx 값이 있으면?
                    //질문 3. 저장된 옵션 idx가 같은가?
                    // questionIdx값이 같은 것은 아무것도 안하니까.. 추가하지 않기
                    //if(){ //NO-> saved된 값의 성향, 점수 가져오기 -> decrease() + 새로운 값 save(),add()
                    console.log("저장된 값 뽑아오기 test 2 :",selectedScore[questionIdx].options);

                    //해결 -> selectedScore에서 option의 idx 값 뽑아오기
                    let isMatch = selectedScore[questionIdx].options.some(function (option) {

                        //some()은 각 요소에 대해 이 함수를 호출해서 조건을 만족하는 요소가 있는지 확인
                        //option은 현재 검사 중인 배열의 요소
                        console.log('option에서 받아온 optionidx 값 : ', option.optionidx); //option idx 뽑아오기 성공
                        if(option.optionidx != optionidx){
                            //저장된 값에서 type과 score 분리하기
                            console.log('option에서 받아온 typeScore 값 :', option.typeScores);

                            decrease(option.typeScores); //저장된 값에 있는 type과 점수 전달 -> decrease에서 감소시키기
                            saveScore(questionIdx,optionidx, data);
                            addScore(data);
                        }
                    });
                }else{//NO
                    //else -> save (), addscore()
                    saveScore(questionIdx,optionidx, data);
                    addScore(data);
                }


                //selectedScore
                //var saved_optionIdx = selectedScore[questionIdx].map(data => data.optionIdx); //questionIdx 키를 가진 값 중
                console.log('저장된 값 있어? 2 :', selectedScore);


            }else{
                saveScore(questionIdx,optionidx, data); // 만약 값이 없으면 바로 save
                addScore(data);
            }

            //클릭했을 때 만약 질문에 대한 문항 idx값이 다를 경우
            //addScore(optionidx, typescore);


        },
        error : function(e){
            console.log(e);

        }
    });
}


//점수 저장하기 ======================================================
function saveScore(questionIdx,optionidx, data){

    // =======================================
    //저장하는 방법...
    //1. 직접 데이터 형태를 만들기 (노가다..노가다...)
    //2. selectedScore에 넣어주기....
    // =======================================

    //1.
    selectedScore[questionIdx] = {
        questionIdx : questionIdx,
        options : []
    }


    // //selectedScore[questionIdx].options.push({넣을 값 작성});


    console.log("typeScore: ", data.typeScore);




    var a = 1;

    var typescores = [];

    var b = 1;
    for(var TypeScore of data.typeScore){ //data (TypeScore 분리하기...)

        console.log('typescore의 길이:', data.typeScore.length); //★

        console.log('type_score : ',typescores);

        //문자열로 저장해서 문제 생김 -> 객체로 저장하기... (★해결...이따구로 코드 짜지 않기...)
        // console.log('saveScore에서 TypeScore 분리한 값:',TypeScore);
        // console.log('"Type' + a + '":' + TypeScore.mbtir_name +','+'"score'  + a + '": "' + TypeScore.mbtiscr_scr + '"');
        // b+= '"Type' + a + '":' + TypeScore.mbtir_name +','+'"score'  + a + '": "' + TypeScore.mbtiscr_scr + '"';


        var typescore_boundary = {}; //type1 :score1끼리 묶어주는 역할
        typescore_boundary[TypeScore.mbtir_name] = TypeScore.mbtiscr_scr;
        // typescore_boundary["Type"+b] = TypeScore.mbtir_name;
        // typescore_boundary["Score" + b] = TypeScore.mbtiscr_scr;
        typescores.push(typescore_boundary); //★typescores 배열에 계속 추가해서 넣으려면 push
        b++;
    }

    selectedScore[questionIdx].options.push({
        optionidx : optionidx,
        typeScores : typescores
    });


    console.log('selectedScore : {} ' + JSON.stringify(selectedScore,null,2)); //잘 들어간 것 같음 -> save까지 완료

}

//전역 변수 설정 ======================================================
//재선언할 수 없는 let으로
//띄어쓰기 있는 문자를 검색해야하니까.. let 잔근육매니아가 아닌.. let scores = {}


//점수 더하기 ======================================================
function addScore(data){
    console.log('받아온값: ', data);
    var a = 1;
    for(var TypeScore of data.typeScore){
        console.log('saveScore에서 TypeScore 분리한 값:',TypeScore);
        console.log('"Type' + a + '":' + TypeScore.mbtir_name +','+'"score'  + a + '": "' + TypeScore.mbtiscr_scr + '"');
        a++;
        scores[TypeScore.mbtir_name]+= TypeScore.mbtiscr_scr;
    }
    console.log('합산 점수 확인하기 : ', JSON.stringify(scores));
};

//점수 빼기 ======================================================
function decrease(typeScores){
    console.log('typeScores 길이: ',typeScores.length);
    for(var z=0; z<typeScores.length; z++){

        console.log('decrease에서 받아온 data 묶음: ', typeScores);
        console.log('decrease에서 받아온 data 첫번째 typeScores: ', typeScores[z]);
        console.log('decrease에서 받아온 data 첫번째 typeScores의 키 배열: ', Object.keys(typeScores[z]));
        for(var key of Object.keys(typeScores[z])){
            console.log('decrease에서 받아온 data typeScores의 키: ', key);
            console.log('decrease에서 받아온 data typeScores의 점수: ', typeScores[z][key]);

            console.log('계산 전 점수:', scores[key]);
            scores[key] -= typeScores[z][key];
            console.log('계산 후 점수:', scores[key]);
        }
    }
}


//이전 버튼 클릭하기
function load_prev_Page (QuestionIdx){
    //현재 질문의 idx 값을 전달해서 만약에 prev 값이 있으면 해당 QuestIdx의 값들을 보여주고
    //없으면 첫번째 질문이라고 하기


}

//다음 버튼 클릭하기 ===============================================
//다음 버튼 클릭하면 현재 idx 값 전달 -> idx보다 큰 idx 값들 찾고 limit 1 걸기
function load_nextPage (QuestionIdx){

    //클릭한 값 있을 때 넘어갈 수 있게 하기
    if(Object.keys(selectedScore).length != 0){//selectedScores에 값이 있는지 보는 방법 -> keys를 구한 다음 그 길이가 0이 아니면 됨
        //자바스크립트의 객체는 .size나 .length를 쓸 수 없음

        //질문의 번호에 해당하는 값이 없으면 막아야함
        if(selectedScore[QuestionIdx] != null){
            nextPageidentifier++;
            $.ajax({
                type : 'GET',
                url : 'question_count.ajax',
                data : {},
                dataType : 'JSON',
                success : function (data){
                    console.log("총 질문의 개수 : ", data.count);
                    //질문의 개수 구하기

                    //만약에 currentIdx <질문의 개수


                    //이전 페이지 질문은 remove되게 하기
                    console.log('nextPageidentifier : ',nextPageidentifier);
                    $('#main_option').empty();

                    $.ajax({
                        type : 'GET',
                        url : 'nextPageIdx.ajax',
                        data : {'lastQIdx' : QuestionIdx},
                        dataType : 'JSON',
                        success : function(result){
                            console.log(result.idx);
                            if(selectedScore)
                                //최소 idx 가져오면 currentQuestionIdx와 minQuestionIdx에 저장하기
                                currentQuestionIdx = result.idx; //이전 페이지 idx 다음 idx 값 가져오기
                            console.log(currentQuestionIdx);
                            console.log(minQuestionIdx);
                            //저장하고 나서
                            isInitialLoad = false;
                            loadQuestion(currentQuestionIdx); //idx 값을 기반으로 //얘가 밑에 있는 문제..
                            drawOption(currentQuestionIdx);
                            if(nextPageidentifier == data.count){ //근데 만약에 질문 idx가 삭제되면????? 해결 nextPageidentifier
                                //마지막이어도 점수는 합산 + save되어야 함
                                $('.next').attr('onclick','goToResultPage(scores)'); //속성으로 들어간 함수 바꾸기 (onclick 속성 안의 함수 바꾸기)
                                $('.next').attr('value','결과 보기');



                                console.log('onclick :', onclick);
                                //결과 보기 버튼 누를 때 initialze 다시 true 상태로 바꾸기
                                // -> 함수 바꾸기 $('.next').attr('onclick');
                            }
                        }
                    });

                },
                error : function (e){

                }
            });
        }else{
            alert('답을 선택해주세요!');
        }




    }else{
        alert('답을 선택해주세요!');
    }
}

var do_append = true;

function goToResultPage(scores){

    if(do_append){

        console.log('결과 버튼 눌림');
        console.log('scores 받아온 값 :',scores);


        //합산한 점수 보내는 방법 ===============================================
        //scores(객체)를 form에 추가해주기 => 합산한 점수 보내는 방법

        //1.form을 가져오기
        //2.scores 분리하기
        //3. input 생성
        //4. input.type과 input.name, input.value 설정해주기..
        //5.form 안에 appendChild?해주기

        //1. 객체에서 key 꺼내기
        var keys = Object.keys(scores);

        var input = '';
        for(var key of keys){ //form에 input 형태로 객체 분리해서 넣어주기
            //key 값 하나씩 가져올 것임
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = scores[key];

            console.log('key:',key);
            console.log('scores.key :',scores[key]); //scores.key가 아닌 scores[key]로 뽑아짐
            $('form').append(input); //append와 appendChild 차이

            //클릭 한번만 되게 하기 - 하고 append 안되게...
            $('form').submit();
            do_append = false;
        }
    }

    console.log('mbti_r.go에 값 보내기 성공 1');

}

//$(요소 선택).load(url, data, 콜백함수)