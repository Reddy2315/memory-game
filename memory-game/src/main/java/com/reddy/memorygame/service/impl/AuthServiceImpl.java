package com.reddy.memorygame.service.impl;

import com.reddy.memorygame.dto.ResponseDTO.LoginRequest;
import com.reddy.memorygame.dto.ResponseDTO.LoginResponse;
import com.reddy.memorygame.dto.ResponseDTO.RegisterRequest;
import com.reddy.memorygame.dto.ResponseDTO.RegisterResponse;
import com.reddy.memorygame.entity.GameUser;
import com.reddy.memorygame.exception.InvalidCredentialsException;
import com.reddy.memorygame.exception.UsernameAlreadyExistsException;
import com.reddy.memorygame.repository.UserRepository;
import com.reddy.memorygame.service.AuthService;
import com.reddy.memorygame.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


    @Override
    public RegisterResponse register(RegisterRequest request) {
        String username = request.username();

        if (userRepository.findByUsername(username).isPresent()) {
            LOGGER.warn("Username already exists: {}", username);
            throw new UsernameAlreadyExistsException(username);
        }

        GameUser user = new GameUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return new RegisterResponse("CREATED", "User registered successfully with username: " + user.getUsername());

    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(request.username());
        return new LoginResponse("Login successful", token);
    }
}
