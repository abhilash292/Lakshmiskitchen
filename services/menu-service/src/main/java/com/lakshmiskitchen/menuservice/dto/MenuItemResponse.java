package com.lakshmiskitchen.menuservice.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public record MenuItemResponse(
        String id,
        String name,
        String description,
        BigDecimal price,
        String category,
        String imageUrl,
        boolean available
) implements Serializable {}