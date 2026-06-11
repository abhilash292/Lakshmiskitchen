package com.lakshmiskitchen.orderservice.client;

import com.lakshmiskitchen.orderservice.dto.OrderDtos.MenuItemDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
public class MenuClient {

    private final RestClient restClient;

    public MenuClient(@Value("${menu.service.url}") String menuServiceUrl) {
        this.restClient = RestClient.create(menuServiceUrl);
    }

    public MenuItemDto getMenuItem(String id) {
        try {
            return restClient.get()
                    .uri("/api/menu/{id}", id)
                    .retrieve()
                    .body(MenuItemDto.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("Menu item not found: " + id);
        } catch (ResourceAccessException e) {
            throw new IllegalStateException("Menu service is currently unavailable. Please try again shortly.");
        }
    }
}