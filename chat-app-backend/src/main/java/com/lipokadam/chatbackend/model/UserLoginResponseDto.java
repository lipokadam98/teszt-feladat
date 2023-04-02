package com.lipokadam.chatbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserLoginResponseDto {
    private Long userId;
    private boolean loggedIn;
    private LocalDateTime validUntil;
}
