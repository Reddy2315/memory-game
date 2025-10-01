package com.reddy.memorygame.dto;

import java.time.OffsetDateTime;

public class ResponseDTO {

    public record RegisterRequest(String username, String password) {
    }

    public record LoginRequest(String username, String password) {
    }

    public record LoginResponse(String message, String accessToken) {
    }

    public record RegisterResponse(String status, String message) {
    }

    public record ApiError(
            OffsetDateTime timestamp,
            int status,
            String error,
            String message,
            String path
    ) {
    }
}
