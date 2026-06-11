package com.lakshmiskitchen.orderservice.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDtos {

    public record OrderItemRequest(
            @NotBlank String menuItemId,
            @Min(value = 1, message = "Quantity must be at least 1") int quantity
    ) {}

    public record CreateOrderRequest(
            @NotBlank String userId,
            @Email @NotBlank String customerEmail,
            @NotEmpty(message = "Order must contain at least one item")
            List<OrderItemRequest> items
    ) {}

    public record OrderItemResponse(String menuItemId, String name, BigDecimal price, int quantity) {}

    public record OrderResponse(String id, String userId, String customerEmail,
                                List<OrderItemResponse> items, BigDecimal totalAmount,
                                String status, Instant createdAt) {}

    public record UpdateStatusRequest(@NotBlank String status) {}

    public record MenuItemDto(String id, String name, String description,
                              BigDecimal price, String category, String imageUrl,
                              boolean available) {}
}