package com.lakshmiskitchen.paymentservice.client;

import com.lakshmiskitchen.paymentservice.dto.PaymentDtos.OrderDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
public class OrderClient {

    private final RestClient restClient;

    public OrderClient(@Value("${order.service.url}") String orderServiceUrl) {
        this.restClient = RestClient.create(orderServiceUrl);
    }

    public OrderDto getOrder(String id) {
        try {
            return restClient.get()
                    .uri("/api/orders/{id}", id)
                    .retrieve()
                    .body(OrderDto.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("Order not found: " + id);
        } catch (ResourceAccessException e) {
            throw new IllegalStateException("Order service is currently unavailable. Please try again shortly.");
        }
    }
}