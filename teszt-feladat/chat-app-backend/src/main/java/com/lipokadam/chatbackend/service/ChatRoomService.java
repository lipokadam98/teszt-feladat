package com.lipokadam.chatbackend.service;

import com.lipokadam.chatbackend.entity.ChatRoom;
import com.lipokadam.chatbackend.repository.ChatRoomRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository){
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatRoom save(ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    public Optional<ChatRoom> findById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId);
    }

    public List<ChatRoom> findAll() {
        return chatRoomRepository.findAll(Sort.by(Sort.Direction.DESC, "creationDate"));
    }
}