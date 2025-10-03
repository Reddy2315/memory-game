package com.reddy.puzzlegame.service.impl;

import com.reddy.puzzlegame.dto.ResponseDTO.LoginRequest;
import com.reddy.puzzlegame.dto.ResponseDTO.LoginResponse;
import com.reddy.puzzlegame.dto.ResponseDTO.RegisterRequest;
import com.reddy.puzzlegame.dto.ResponseDTO.RegisterResponse;
import com.reddy.puzzlegame.entity.GameUser;
import com.reddy.puzzlegame.exception.InvalidCredentialsException;
import com.reddy.puzzlegame.exception.UsernameAlreadyExistsException;
import com.reddy.puzzlegame.repository.UserRepository;
import com.reddy.puzzlegame.service.AuthService;
import com.reddy.puzzlegame.util.JwtUtil;
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
