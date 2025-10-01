package com.reddy.memorygame.config;

import com.reddy.memorygame.dto.ResponseDTO.ApiError;
import com.reddy.memorygame.exception.InvalidCredentialsException;
import com.reddy.memorygame.exception.UsernameAlreadyExistsException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
        var body = new ApiError(OffsetDateTime.now(), HttpStatus.UNAUTHORIZED.value(), "UNAUTHORIZED", ex.getMessage(), req.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUsernameExists(UsernameAlreadyExistsException ex, HttpServletRequest req) {
        var body = new ApiError(OffsetDateTime.now(), HttpStatus.CONFLICT.value(),
                "CONFLICT", ex.getMessage(), req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

}
