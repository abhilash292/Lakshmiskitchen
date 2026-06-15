package com.lakshmiskitchen.orderservice.service;
import com.lakshmiskitchen.orderservice.client.MenuClient;
import com.lakshmiskitchen.orderservice.dto.OrderDtos.*;
import com.lakshmiskitchen.orderservice.entity.Order;
import com.lakshmiskitchen.orderservice.entity.OrderItem;
import com.lakshmiskitchen.orderservice.entity.OrderStatus;
import com.lakshmiskitchen.orderservice.event.OrderPlacedEvent;
import com.lakshmiskitchen.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuClient menuClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderResponse createOrder(CreateOrderRequest request) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.items()) {
            MenuItemDto menuItem = menuClient.getMenuItem(itemReq.menuItemId());
            if (!menuItem.available()) {
                throw new IllegalArgumentException(menuItem.name() + " is currently unavailable");
            }
            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.id())
                    .name(menuItem.name())
                    .price(menuItem.price())
                    .quantity(itemReq.quantity())
                    .build();
            orderItems.add(orderItem);
            total = total.add(menuItem.price().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }
        Order order = Order.builder()
                .userId(request.userId())
                .customerEmail(request.customerEmail())
                .items(orderItems)
                .totalAmount(total)
                .build();
        Order saved = orderRepository.save(order);
        OrderPlacedEvent event = new OrderPlacedEvent(
                saved.getId(),
                saved.getUserId(),
                saved.getCustomerEmail(),
                saved.getItems().stream().map(OrderItem::getName).toList(),
                saved.getTotalAmount(),
                saved.getCreatedAt()
        );
        kafkaTemplate.send("order-events", event);
        return toResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse getById(String id) {
        return orderRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public List<OrderResponse> getByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse updateStatus(String id, UpdateStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        try {
            order.setStatus(OrderStatus.valueOf(request.status().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: PLACED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
        }
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(i.getMenuItemId(), i.getName(), i.getPrice(), i.getQuantity()))
                .toList();
        return new OrderResponse(order.getId(), order.getUserId(), order.getCustomerEmail(),
                items, order.getTotalAmount(), order.getStatus().name(), order.getCreatedAt());
    }
}
