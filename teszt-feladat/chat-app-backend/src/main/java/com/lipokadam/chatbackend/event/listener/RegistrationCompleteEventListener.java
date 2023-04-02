package com.lipokadam.chatbackend.event.listener;

import com.lipokadam.chatbackend.entity.User;
import com.lipokadam.chatbackend.event.RegistrationCompleteEvent;
import com.lipokadam.chatbackend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    private final UserService userService;

    public RegistrationCompleteEventListener(UserService userService){
        this.userService = userService;
    }

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        //Create the Verification token for the user with link
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        userService.saveVerificationTokenForUser(token,user);
        String url = event.getApplicationUrl()+"/verifyRegistration?token="+token;
        //Send Mail to user
        //sendVerificationEmail()
        log.info("Click the link to verify your account: {}"+url);
    }
}
