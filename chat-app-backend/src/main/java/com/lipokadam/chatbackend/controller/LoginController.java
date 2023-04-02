package com.lipokadam.chatbackend.controller;

import com.lipokadam.chatbackend.exception.ChatException;
import com.lipokadam.chatbackend.model.UserLoginDto;
import com.lipokadam.chatbackend.model.UserLoginResponseDto;
import com.lipokadam.chatbackend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    public LoginController(UserService userService,PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public UserLoginResponseDto login(@RequestBody UserLoginDto userLoginDto) {
        var user = userService.findUserByEmail(userLoginDto.getEmail());

        if(user == null){
            return new UserLoginResponseDto(null,false,null);
        }
        if (passwordEncoder.matches(userLoginDto.getPassword(),user.getPassword())){
            return new UserLoginResponseDto(user.getId(),true,LocalDateTime.now().plusHours(3));
        }else{
            throw new ChatException("A jelszó nem megfelelő",500);
        }
    }

}
