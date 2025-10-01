package com.reddy.memorygame.service;


import com.reddy.memorygame.dto.ResponseDTO.LoginResponse;
import com.reddy.memorygame.dto.ResponseDTO.LoginRequest;
import com.reddy.memorygame.dto.ResponseDTO.RegisterRequest;
import com.reddy.memorygame.dto.ResponseDTO.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
