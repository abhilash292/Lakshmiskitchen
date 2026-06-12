package com.lakshmiskitchen.userservice.dto;

public record LoginResponse(String token, UserResponse user) {}