package com.lipokadam.chatbackend.service;

import com.lipokadam.chatbackend.entity.Message;
import com.lipokadam.chatbackend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository){
        this.messageRepository = messageRepository;
    }

    public Message save(Message message) {
        return messageRepository.save(message);
    }
    public Collection<Message> findMessagesByChatId(Long chatId){ return messageRepository.findByChatRoomId(chatId);}
}
