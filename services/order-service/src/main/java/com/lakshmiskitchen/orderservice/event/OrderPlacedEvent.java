package com.lakshmiskitchen.orderservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderPlacedEvent(
        String orderId,
        String userId,
        String customerEmail,
        List<String> itemNames,
        BigDecimal totalAmount,
        Instant placedAt
) {}