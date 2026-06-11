package com.lakshmiskitchen.paymentservice.service;

import com.lakshmiskitchen.paymentservice.client.OrderClient;
import com.lakshmiskitchen.paymentservice.dto.PaymentDtos.*;
import com.lakshmiskitchen.paymentservice.entity.Payment;
import com.lakshmiskitchen.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;

    public PaymentResponse pay(CreatePaymentRequest request) {
        if (paymentRepository.existsByOrderId(request.orderId())) {
            throw new IllegalArgumentException("Payment already exists for this order");
        }

        OrderDto order = orderClient.getOrder(request.orderId());

        // Simulated payment: always succeeds (real gateway integration comes later)
        Payment payment = Payment.builder()
                .orderId(order.id())
                .amount(order.totalAmount())
                .method(request.method())
                .status("SUCCESS")
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    public PaymentResponse getByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("No payment found for this order"));
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getOrderId(), p.getAmount(),
                p.getMethod(), p.getStatus(), p.getCreatedAt());
    }
}