package com.lakshmiskitchen.notificationservice.listener;

import com.lakshmiskitchen.notificationservice.event.OrderPlacedEvent;
import com.lakshmiskitchen.notificationservice.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {

    private static final Logger log = LoggerFactory.getLogger(OrderEventListener.class);

    private final EmailService emailService;

    public OrderEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void onOrderPlaced(OrderPlacedEvent event) {
        log.info("🔔 Received OrderPlacedEvent for order {}", event.orderId());
        emailService.sendOrderConfirmation(event);
    }
}