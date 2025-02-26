package com.fitmate.chat.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/chat/{nick_name}")
public class WsChatController {
    Logger logger = LoggerFactory.getLogger(getClass());
    static Map<String, Session> userList = new HashMap<>();
    @OnOpen
    public void onOpen(Session session, @PathParam("nick_name") String nick_name) {
        logger.info("접속한 세션 ID: " + nick_name);
        userList.put(nick_name, session);
        logger.info("채팅방 리스트: " + userList.size());
    }

    @OnClose
    public void onClose(Session session) {
        String close_id = session.getId();
        logger.info("종료한 세션 id: " + close_id);
        for(Map.Entry<String, Session> entry : userList.entrySet()) {
            if(entry.getValue().equals(close_id)) {
                userList.remove(entry.getKey());
                break;
            }
            logger.info("회원 리스트 : " + userList.keySet());
        }
    }

    @OnError
    public void onError(Session session, Throwable e) {
        logger.info("에러난 세션 ID:"+ session.getId()+"원인 : "+e.toString());
    }

    @OnMessage
    public void onMessage(String message){
        List<String> chat_participant = new ArrayList<>();
        logger.info("채팅 내용 : "+ message);
        String[]arr = message.split("/");
        String nickname = arr[0];
        String chat_msg = arr[1];
        String chat_date = arr[2];
        String chat_participant_str = arr[3];

        //배열이면
        if(chat_participant_str.contains(",")){
            String[] userIds = chat_participant_str.split(",");
            for(String userId : userIds){
                chat_participant.add(userId);
            }
        }else {
            chat_participant.add(chat_participant_str);
        }
        broad_cast("{\"nick\":\"" + arr[0] + "\",\"content\":\"" + arr[1] + "\",\"date\":\"" + arr[2] + "\"}", chat_participant);
    }

    public void broad_cast(String msg, List<String> chat_participant){
        logger.info("채팅 보낼 사람 목록 : " + chat_participant);
        for(String user_nick : userList.keySet()){
            if(chat_participant.contains(user_nick)){
                logger.info("채팅 보낼 사람:{}", user_nick);};
                Session session = userList.get(user_nick);

            try {
                session.getBasicRemote().sendText(msg);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        }
    }
