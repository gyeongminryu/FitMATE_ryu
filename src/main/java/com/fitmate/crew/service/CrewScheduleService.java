package com.fitmate.crew.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitmate.crew.dao.CrewPageDAO;
import com.fitmate.crew.dao.CrewScheduleDAO;
import com.fitmate.crew.dto.CrewDTO;
import com.fitmate.crew.dto.CrewMemberDTO;
import com.fitmate.crew.dto.CrewScheduleDTO;

@Service
public class CrewScheduleService {
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired CrewScheduleDAO crewschedule_dao;
	
	// 크루원 목록 가져오기
	@Autowired CrewPageDAO crewpage_dao;
	
	public void crew_plan_create(String[] days, String crew_id, String crew_idx, String date, String start_time,
			String end_time, String place, String content, String subject) {
		

		// 받은값 형변환 해주기
		int crewidx = Integer.parseInt(crew_idx);	
		LocalTime startTime = LocalTime.parse(start_time, DateTimeFormatter.ofPattern("HH:mm"));
		LocalTime endTime = LocalTime.parse(end_time, DateTimeFormatter.ofPattern("HH:mm"));
		LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		
		logger.info("시작시간"+startTime);
		logger.info("종료시간"+endTime);
		
		CrewScheduleDTO plan_dto = new CrewScheduleDTO();

		 // 오늘 날짜 가져오기
		 LocalDate today = LocalDate.now();
		
		 // 오늘 날짜의 요일 가져오기
	     DayOfWeek dayOfWeek = localDate.getDayOfWeek();
	     
	     // 이번달 마지막 날짜
	     LocalDate lastDayOfMonth = localDate.withDayOfMonth(localDate.lengthOfMonth());
	     
	     // 오늘부터 이번 달 마지막 날까지의 날짜 리스트 만들기
	     List<LocalDate> datesInMonth = new ArrayList<>();
	       for (LocalDate daydate = localDate; !daydate.isAfter(lastDayOfMonth); daydate = daydate.plusDays(1)) {
	           datesInMonth.add(daydate);
	       }
		
	     int lastday = lastDayOfMonth.getDayOfMonth();
	     int startday = localDate.getDayOfMonth();
	     
	     int datelength = lastday - startday;
	     
	    
	     
		// days 배열로 주기적 작성하기
		if(days == null) {
			plan_dto.setCrew_idx(crewidx);
			plan_dto.setPlan_content(content);
			plan_dto.setPlan_date(localDate);
			plan_dto.setPlan_end(endTime);
			plan_dto.setPlan_place(place);
			plan_dto.setPlan_start(startTime);
			plan_dto.setPlan_subject(subject);
			crewschedule_dao.crew_plan_create(plan_dto);
		}
		else {
			
			int[] arr = new int[days.length];
			// days 문자열 값을 int 값으로 바꿔 저장하기
			for (int i =0; i<days.length; i++) {
				arr[i]= Integer.parseInt(days[i]);
			}

			// 오늘부터 이번달 마지막 날까지 반복시키기
			 for (LocalDate date1 : datesInMonth) {
				 //	logger.info("날짜는 = ",date1);
		            for(int j=0; j<arr.length; j++) {
						if(arr[j]==date1.getDayOfWeek().getValue()) {
							plan_dto.setCrew_idx(crewidx);
							plan_dto.setPlan_content(content);
							plan_dto.setPlan_date(date1);
							plan_dto.setPlan_end(endTime);
							plan_dto.setPlan_place(place);
							plan_dto.setPlan_start(startTime);
							plan_dto.setPlan_subject(subject);
							crewschedule_dao.crew_plan_create(plan_dto);
							logger.info("날짜는 = "+date1+" 요일값은 = "+j);
						}
					}
		        } // for (LocalDate date1 : datesInMonth)
			
		} // else
		// 크루 최종 활동일 바꿔주기
		crewpage_dao.crew_lastdate_update(crewidx);
		// 알람로직 실행하기
		crew_plan_noti(crew_idx);
		
		
	}
		// 일정작성시 해당 가입 크루원들에게 알람보내기
		public void crew_plan_noti(String crew_idx) {
		
		CrewDTO crew = new CrewDTO();
		int crewidx = Integer.parseInt(crew_idx);	
		crew.setCrew_idx(crewidx);
		logger.info("crew_idx = "+crew_idx);
		// 크루 이름 가져오기
		String name = crewpage_dao.notice_noti_crewname(crew);;
		logger.info("name = "+name);
	//	String crewidx = Integer.toString(crew_idx);
		
		// 알람 내용
		String noti_content = name+" 크루에 새로운 일정이 생성되었습니다.";
		// url 주소 == 크루페이지 기능이 완성되면 크루페이지 주소로 보내주기
		
		// crew_idx = 스트링값이어서 형변환 안해도됨
		String noti_url = crew_idx+"=크루일정url주소";
		// 크루원 목록 가져오기
		List<CrewMemberDTO> member_list = crewpage_dao.crew_member_list(crewidx);
		
		// 알림 보내기
		for (CrewMemberDTO  member : member_list) {
			// 멤버 id(수신자id) 가져오기
			String member_id = member.getMember_id();
			int board_idx = 0; // 크루일정은 보드idx 가 없어서 0으로 임시 설정
			// 알림 보내는 로직 멤버 한명씩 보내기 name = 크루명을 나중에 1 로 바꿔주기 
			crewpage_dao.crew_notice_noti(member_id,board_idx,noti_content,noti_url,name);
			}
		
	}

}
