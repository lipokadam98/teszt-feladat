package com.lipokadam.chatbackend.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class ResendTokenEvent extends ApplicationEvent {
    private String token;
    private String applicationUrl;
    public ResendTokenEvent(String token, String applicationUrl) {
        super(token);
        this.token = token;
        this.applicationUrl = applicationUrl;
    }

}
