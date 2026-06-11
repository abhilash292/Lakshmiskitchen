package com.lakshmiskitchen.userservice.service;

import com.lakshmiskitchen.userservice.dto.LoginRequest;
import com.lakshmiskitchen.userservice.dto.RegisterRequest;
import com.lakshmiskitchen.userservice.dto.UserResponse;
import com.lakshmiskitchen.userservice.entity.User;
import com.lakshmiskitchen.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .build();

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(),
                user.getPhone(), user.getRole());
    }
}