package com.lipokadam.chatbackend.repository;

import com.lipokadam.chatbackend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository  extends JpaRepository<VerificationToken,Long> {
    VerificationToken findByToken(String token);
}
