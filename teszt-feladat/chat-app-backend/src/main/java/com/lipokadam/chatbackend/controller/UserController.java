package com.lipokadam.chatbackend.controller;

import com.lipokadam.chatbackend.entity.User;
import com.lipokadam.chatbackend.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}
