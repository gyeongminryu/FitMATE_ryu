package com.fitmate.chat.dao;

import com.fitmate.chat.dto.ChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChatDAO {

    List<Map<String, Object>> get_chat_group_member(String member_id);
    List<Map<String, Object>> get_chat_group_crew(String member_id);

    int find_chat_group(String member1, String member2);

    int get_chat_group_idx(String member1, String member2);

    int create_chat_group(ChatDTO chatDto);

    void insert_chat_grp_member(int msg_grp_idx, String member);

    void insert_chat_grp_crew(int chat_grp_idx, int crew_idx);

    //메시지 입력(채팅 처음 만들 때는 반드시 system 알림 넣기)
    void insert_chat_msg(String sender_id, String content, int group_idx);

    String get_my_nick_name(String login_id);

    List<Map<String,Object>> get_chat_list(String chat_group_idx);


    String get_chat_group_cate(String chat_group_idx);

    List<String> get_chat_participants_member(String chat_group_idx);

    List<String> get_chat_participants_crew(String chat_group_idx);

    int insert_chat(String grp_idx, String login_id, String chat_msg, String date);
}
