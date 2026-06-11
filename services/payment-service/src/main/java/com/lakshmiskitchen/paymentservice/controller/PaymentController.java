package com.lakshmiskitchen.paymentservice.controller;

import com.lakshmiskitchen.paymentservice.dto.PaymentDtos.*;
import com.lakshmiskitchen.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.pay(request));
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getByOrder(@PathVariable String orderId) {
        return paymentService.getByOrderId(orderId);
    }
}