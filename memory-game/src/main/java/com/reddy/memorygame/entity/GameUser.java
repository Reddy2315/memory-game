package com.reddy.memorygame.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "password")
@Entity
@Table(name = "users",
        indexes = { @Index(name = "uk_users_username", columnList = "username", unique = true) })
public class GameUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    // BCrypt hashes are 60 chars; allocate >= 60 (e.g., 100–255 for flexibility)
    @Column(nullable = false, length = 100)
    private String password;
}
