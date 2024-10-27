package com.fitmate.admin.dao;

import com.fitmate.admin.dto.DashboardDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MainDAO {

    // layout
    String getname(int admin_idx);

    // 로그인
    int login(String admin_id, String pw);
    int checkid(String admin_id);
    int getidx(String admin_id);

    // 대시보드 > 공지사항 목록
    List<DashboardDTO> dashboardList();
}
