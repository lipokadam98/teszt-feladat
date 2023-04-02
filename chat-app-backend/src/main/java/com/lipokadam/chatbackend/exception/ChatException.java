package com.lipokadam.chatbackend.exception;

public class ChatException extends RuntimeException {
    private String message;
    private int errorCode;

    public ChatException(String message, int errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public int getErrorCode() {
        return errorCode;
    }
}