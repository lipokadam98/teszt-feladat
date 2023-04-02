package com.lipokadam.chatbackend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomUserDto {
    @NotNull
    private Long userId;

    @NotNull
    @NotBlank
    private String email;
}
