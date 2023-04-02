package com.lipokadam.chatbackend.service;

import com.lipokadam.chatbackend.entity.User;
import com.lipokadam.chatbackend.entity.VerificationToken;
import com.lipokadam.chatbackend.model.UserModel;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserModel userModel);

    void saveVerificationTokenForUser(String token, User user);

    String validateVerificationToken(String token);

    VerificationToken generateNewVerificationToken(String oldToken);

    User findUserByEmail(String email);

    void createPasswordResetTokenForUser(User user, String token);

    String validatePasswordResetToken(String token);

    Optional<User> getUserByPasswordResetToken(String token);

    void changePassword(User user, String newPassword);

    boolean checkIfValidOldPassword(User user, String oldPassword);

    List<User> findAll();
    Optional<User> findById(Long id);
    User saveUser(User user);
}
