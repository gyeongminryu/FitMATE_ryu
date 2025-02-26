package com.fitmate.chat.controller;

import com.fitmate.chat.service.ChatService;
import org.slf4j.ILoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatController {
    @Autowired ChatService chat_service;
    Logger logger = LoggerFactory.getLogger(getClass());


    @PostMapping(value="/member_find_chat_group.ajax")
    @ResponseBody
    public Map <String,Integer> find_chat_group(HttpSession session, String member2) {
        Map <String,Integer> data= new HashMap<>();
        String member1 = session.getAttribute("loginId").toString();
        data.put("group_idx",chat_service.find_chat_group(member1,member2));
        return data;
    }

    @RequestMapping (value="/chat_group_list.go")
    public String chat_group_list(HttpSession session, Model model) {
        //여기서 sessionId 가지고 전달
        String member_id = session.getAttribute("loginId").toString();
        chat_service.get_chat_group(member_id,model);

        return "chat_group_list";
    }

    @RequestMapping (value = "/chat_list.go")
    public String chat_list(String chat_group_idx,String chat_group_name, HttpSession session, Model model) {
        String login_id = session.getAttribute("loginId").toString();
        chat_service.get_chat_list(chat_group_idx,chat_group_name,login_id,model);
        return "chat_list";
    }

    @GetMapping (value="/insert_chat.ajax")
    @ResponseBody
    public Map<String,Object> insert_chat(HttpSession session, Model model,String grp_idx, String nick_name, String chat_msg,String date) {
        Map<String,Object> success = new HashMap<>();
        String login_id = session.getAttribute("loginId").toString();

        if(chat_service.insert_chat(grp_idx,login_id,chat_msg,date)){
            success.put("success","true");
        }else{
            success.put("success","false");
        }
        return success;
    }

}
