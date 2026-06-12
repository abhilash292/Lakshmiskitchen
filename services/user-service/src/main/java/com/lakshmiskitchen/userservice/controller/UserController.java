package com.lakshmiskitchen.userservice.controller;

import com.lakshmiskitchen.userservice.dto.LoginRequest;
import com.lakshmiskitchen.userservice.dto.LoginResponse;
import com.lakshmiskitchen.userservice.dto.RegisterRequest;
import com.lakshmiskitchen.userservice.dto.UserResponse;
import com.lakshmiskitchen.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
}