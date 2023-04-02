package com.lipokadam.chatbackend.service;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, List<WebSocketSession>> sessionsByGroup = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String groupId = extractGroupId(session);
        sessionsByGroup.computeIfAbsent(groupId, k -> new ArrayList<>()).add(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String groupId = extractGroupId(session);
        List<WebSocketSession> sessions = sessionsByGroup.get(groupId);
        for (WebSocketSession s : sessions) {
            if (!s.getId().equals(session.getId())) {
                s.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String groupId = extractGroupId(session);
        sessionsByGroup.computeIfPresent(groupId, (k, v) -> {
            v.remove(session);
            return v.isEmpty() ? null : v;
        });
    }

    private String extractGroupId(WebSocketSession session) {
        UriComponents uriComponents = UriComponentsBuilder.fromUri(session.getUri()).build();
        return uriComponents.getQueryParams().getFirst("groupId");
    }
}