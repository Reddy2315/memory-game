package com.reddy.memorygame.repository;

import com.reddy.memorygame.entity.GameUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<GameUser, Long> {

    Optional<GameUser> findByUsername(String username);
}
