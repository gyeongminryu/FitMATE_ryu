package com.fitmate.chat.service;

import com.fitmate.chat.dao.ChatDAO;
import com.fitmate.chat.dto.ChatDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {
    @Autowired ChatDAO chat_dao;
    Logger logger = LoggerFactory.getLogger(getClass());
    public void get_chat_group(String member_id, Model model) {
        logger.info("member_id:{}",member_id);
        model.addAttribute("member_chat_grp",chat_dao.get_chat_group_member(member_id));
        model.addAttribute("crew_chat_grp",chat_dao.get_chat_group_crew(member_id));
        model.addAttribute("nick_name",chat_dao.get_my_nick_name(member_id));

    }


    public int find_chat_group(String member1, String member2) {
        int msg_group_idx = 0;
        ChatDTO chat_dto = new ChatDTO();

        //만약 채팅 그룹이 있으면 group_idx 가져오기
        if(chat_dao.find_chat_group(member1,member2) > 0){
            msg_group_idx = chat_dao.get_chat_group_idx(member1,member2);
            //만약 채팅 그룹이 없으면 만들고 group_idx 가져오기
        }else{
            //바로 가져오기 위해 DTO 사용
            chat_dto.setMember1(member1);
            chat_dto.setMember2(member2);
            chat_dto.setMsg_group_cate("member");
            chat_dao.create_chat_group(chat_dto);
            msg_group_idx =chat_dto.getMsg_group_idx();


            chat_dao.insert_chat_grp_member(msg_group_idx,member1);
            chat_dao.insert_chat_grp_member(msg_group_idx,member2);

            chat_dao.insert_chat_msg("system","1:1 채팅이 시작되었습니다.",msg_group_idx);

        }

        return msg_group_idx;
    }

    public void get_chat_list(String chat_group_idx,String chat_group_name, String login_id,Model model) {
        //내 닉네임 확인
        model.addAttribute("nick_name",chat_dao.get_my_nick_name(login_id));

        //채팅 그룹 이름 보내기
        model.addAttribute("chat_group_name",chat_group_name);

        //채팅 목록 가져오기 (loginId의 닉네임도)
        model.addAttribute("chat_list",chat_dao.get_chat_list(chat_group_idx));


        //채팅 카데고리 구하기
        String group_cate = chat_dao.get_chat_group_cate(chat_group_idx);
        List<String> chat_participant_list = new ArrayList<>();
        if(group_cate.equals("member")){
            chat_participant_list = chat_dao.get_chat_participants_member(chat_group_idx);
        }else if(group_cate.equals("crew")){
            chat_participant_list = chat_dao.get_chat_participants_crew(chat_group_idx);
        }

        //채팅 참여자
        model.addAttribute("chat_participant",chat_participant_list);

        //채팅 카데고리
        model.addAttribute("group_cate",group_cate);
    }

    public boolean insert_chat(String grp_idx, String login_id, String chat_msg, String date) {
        boolean success = false;
        if(chat_dao.insert_chat(grp_idx,login_id,chat_msg,date)>0){
            success = true;
        };

        return success;
    }
}
