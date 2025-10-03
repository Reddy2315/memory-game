package com.reddy.puzzlegame.service.impl;

import com.reddy.puzzlegame.entity.GameUser;
import com.reddy.puzzlegame.repository.UserRepository;
import com.reddy.puzzlegame.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        GameUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    LOGGER.warn("User not found: {}", username);
                    return new UsernameNotFoundException("User not found");
                });

        return new User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
