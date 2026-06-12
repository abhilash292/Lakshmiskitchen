package com.lakshmiskitchen.notificationservice.service;

import com.lakshmiskitchen.notificationservice.event.OrderPlacedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final boolean emailEnabled;
    private final String fromAddress;

    public EmailService(JavaMailSender mailSender,
                        @Value("${notification.email.enabled}") boolean emailEnabled,
                        @Value("${notification.email.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.emailEnabled = emailEnabled;
        this.fromAddress = fromAddress;
    }

    public void sendOrderConfirmation(OrderPlacedEvent event) {
        String subject = "Order Confirmed - Lakshmis Kitchen 🍲";
        String body = """
                Namaste!

                Thank you for your order at Lakshmis Kitchen.

                Order ID: %s
                Items: %s
                Total: $%s

                We are preparing your food with love. You will hear from us when it's on the way!

                - Lakshmis Kitchen
                """.formatted(event.orderId(), String.join(", ", event.itemNames()), event.totalAmount());

        if (!emailEnabled) {
            log.info("📧 [EMAIL DISABLED - LOG MODE] Would send to: {} | Subject: {} | Body: {}",
                    event.customerEmail(), subject, body);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(event.customerEmail());
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        log.info("📧 Order confirmation email sent to {}", event.customerEmail());
    }
}