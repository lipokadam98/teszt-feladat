package com.lipokadam.chatbackend.repository;


import com.lipokadam.chatbackend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("select m from Message m where m.chatRoom.id = ?1 order by m.creationDate asc")
    Collection<Message> findByChatRoomId(Long chatRoomId);
}