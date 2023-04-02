package com.lipokadam.chatbackend.repository;

import com.lipokadam.chatbackend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {

}
