package com.lipokadam.chatbackend.event.listener;

import com.lipokadam.chatbackend.event.ResendTokenEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ResendTokenCompleteEventListener implements ApplicationListener<ResendTokenEvent> {

    @Override
    public void onApplicationEvent(ResendTokenEvent event) {

        String url = event.getApplicationUrl()+"/verifyRegistration?token="+event.getToken();
        //Send Mail to user
        //sendVerificationEmail()
        log.info("Click the link to verify your account: {}"+url);
    }
}
