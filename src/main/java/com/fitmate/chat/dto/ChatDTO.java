package com.fitmate.chat.dto;

public class ChatDTO {

    private int msg_group_idx;
    private String msg_group_cate;

    public String getMsg_group_cate() {
        return msg_group_cate;
    }

    public void setMsg_group_cate(String msg_group_cate) {
        this.msg_group_cate = msg_group_cate;
    }

    public int getMsg_group_idx() {
        return msg_group_idx;
    }

    public void setMsg_group_idx(int msg_group_idx) {
        this.msg_group_idx = msg_group_idx;
    }

    public String getMember1() {
        return member1;
    }

    public void setMember1(String member1) {
        this.member1 = member1;
    }

    public String getMember2() {
        return member2;
    }

    public void setMember2(String member2) {
        this.member2 = member2;
    }

    //1:1메시지 일 경우
    private String member1;
    private String member2;

}
