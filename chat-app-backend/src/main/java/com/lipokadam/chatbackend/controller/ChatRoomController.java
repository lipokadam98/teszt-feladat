package com.lipokadam.chatbackend.controller;

import com.lipokadam.chatbackend.entity.ChatRoom;
import com.lipokadam.chatbackend.entity.Message;
import com.lipokadam.chatbackend.exception.ChatException;
import com.lipokadam.chatbackend.model.ChatRoomUserDto;
import com.lipokadam.chatbackend.model.MessageDto;
import com.lipokadam.chatbackend.service.ChatRoomService;
import com.lipokadam.chatbackend.service.MessageService;
import com.lipokadam.chatbackend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chatroom")
public class ChatRoomController {


    private final ChatRoomService chatRoomService;

    private final UserService userService;

    private final MessageService messageService;

    public ChatRoomController(ChatRoomService chatRoomService,UserService userService,MessageService messageService){
        this.chatRoomService = chatRoomService;
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping("/getall")
    public List<ChatRoom> getAllChatRoom(){
        return chatRoomService.findAll();
    }

    @GetMapping("/getbyid")
    public ChatRoom getChatRoomById(@RequestParam Long id){
        var room = chatRoomService.getRoomById(id);

        if(room.isEmpty()){
            throw new ChatException("A szoba nem található",500);
        }

        return room.get();
    }


    @PostMapping("/create")
    public ChatRoom createChatRoom(@RequestBody ChatRoom chatRoom) {
        chatRoom.setCreationDate(LocalDateTime.now());
        return chatRoomService.save(chatRoom);
    }

    @PostMapping("/{chatRoomId}/users")
    public ChatRoom addUserToChatRoom(@PathVariable Long chatRoomId, @RequestBody ChatRoomUserDto chatRoomUserDto) {
        ChatRoom chatRoom = chatRoomService.findById(chatRoomId).orElseThrow();

        var user = userService.findById(chatRoomUserDto.getUserId());

        if(user.isPresent()){
            var foundUser = user.get();
            var filtered = chatRoom.getUsers().stream().filter(user1 -> user1.getId().equals(foundUser.getId()));
            if(filtered.toList().size() > 0){
                throw new RuntimeException("Ez a user már hozzá lett adva a szobához.");
            }
            chatRoom.addUser(foundUser);
        }else{
            throw new RuntimeException("A hozzáadni kívánt user nem található");
        }

        return chatRoomService.save(chatRoom);
    }

    @PostMapping("/{chatRoomId}/addmessage")
    public Message sendMessage(@PathVariable Long chatRoomId, @RequestBody MessageDto messageDto) {
        ChatRoom chatRoom = chatRoomService.findById(chatRoomId).orElseThrow();

        var user = userService.findById(messageDto.getUserId());
        var message = new Message();
        message.setContent(messageDto.getMessage());
        message.setChatRoom(chatRoom);
        user.ifPresent(message::setUser);
        message.setCreationDate(LocalDateTime.now());

        return messageService.save(message);
    }

    @GetMapping("/{chatRoomId}/messages")
    public List<Message> getMessages(@PathVariable Long chatRoomId) {
        return (List<Message>) messageService.findMessagesByChatId(chatRoomId);
    }
}