package com.lakshmiskitchen.paymentservice.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class PaymentDtos {

    public record CreatePaymentRequest(
            @NotBlank String orderId,
            @NotBlank String method
    ) {}

    public record PaymentResponse(String id, String orderId, BigDecimal amount,
                                  String method, String status, Instant createdAt) {}

    public record OrderItemDto(String menuItemId, String name, BigDecimal price, int quantity) {}

    public record OrderDto(String id, String userId, String customerEmail,
                           List<OrderItemDto> items, BigDecimal totalAmount,
                           String status, Instant createdAt) {}
}