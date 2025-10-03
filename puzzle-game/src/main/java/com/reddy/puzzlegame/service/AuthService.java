package com.reddy.puzzlegame.service;


import com.reddy.puzzlegame.dto.ResponseDTO.LoginResponse;
import com.reddy.puzzlegame.dto.ResponseDTO.LoginRequest;
import com.reddy.puzzlegame.dto.ResponseDTO.RegisterRequest;
import com.reddy.puzzlegame.dto.ResponseDTO.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
